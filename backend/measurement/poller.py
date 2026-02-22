"""
Background poller — polls GPU, CPU, and NPU every 1 second.
Maintains a rolling 60-second buffer and pushes readings to a WebSocket queue.
"""
import asyncio
import time
import threading
import logging
from collections import deque
from typing import Callable

from measurement.gpu import read_gpu_power
from measurement.cpu import read_cpu_power
from measurement.npu import read_npu_power

logger = logging.getLogger(__name__)

BUFFER_SIZE = 60  # seconds of rolling history


class PowerPoller:
    """
    Runs a background thread that polls hardware every `interval` seconds.
    Maintains a rolling deque of PowerReading dicts.
    Calls registered callbacks with each new reading.
    """

    def __init__(self, interval: float = 1.0):
        self.interval = interval
        self.buffer: deque[dict] = deque(maxlen=BUFFER_SIZE)
        self._callbacks: list[Callable[[dict], None]] = []
        self._thread: threading.Thread | None = None
        self._stop_event = threading.Event()
        self._co2_cumulative: float = 0.0
        self._grid_intensity_g_kwh: float = 820.0  # updated by carbon module

    def set_grid_intensity(self, intensity: float) -> None:
        self._grid_intensity_g_kwh = intensity

    def register_callback(self, cb: Callable[[dict], None]) -> None:
        self._callbacks.append(cb)

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._poll_loop, daemon=True)
        self._thread.start()
        logger.info("PowerPoller started")

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)
        logger.info("PowerPoller stopped")

    def get_latest(self) -> dict | None:
        return self.buffer[-1] if self.buffer else None

    def get_buffer(self) -> list[dict]:
        return list(self.buffer)

    def _poll_loop(self) -> None:
        while not self._stop_event.is_set():
            start = time.monotonic()
            reading = self._take_reading()
            self.buffer.append(reading)
            for cb in self._callbacks:
                try:
                    cb(reading)
                except Exception as e:
                    logger.warning(f"Callback error: {e}")
            elapsed = time.monotonic() - start
            sleep_for = max(0.0, self.interval - elapsed)
            self._stop_event.wait(timeout=sleep_for)

    def _take_reading(self) -> dict:
        ts = int(time.time())

        gpu_w, gpu_util, gpu_live = read_gpu_power()
        cpu_w, cpu_util, cpu_live = read_cpu_power()
        npu_w, npu_util, npu_live = read_npu_power()

        total_w = gpu_w + cpu_w + (npu_w or 0.0)

        # Accumulate CO2: energy in Wh for this 1-second interval
        energy_wh = total_w * (self.interval / 3600.0)
        co2_g = energy_wh * self._grid_intensity_g_kwh
        self._co2_cumulative += co2_g

        source = "live" if (gpu_live or cpu_live) else "estimated"

        return {
            "gpu_watts": round(gpu_w, 1),
            "cpu_watts": round(cpu_w, 1),
            "npu_watts": round(npu_w, 1) if npu_w is not None else None,
            "total_watts": round(total_w, 1),
            "gpu_utilization_pct": round(gpu_util, 1),
            "cpu_utilization_pct": round(cpu_util, 1),
            "npu_utilization_pct": round(npu_util, 1) if npu_util is not None else None,
            "timestamp": ts,
            "co2_g_cumulative": round(self._co2_cumulative, 4),
            "source": source,
        }

    def reset_co2(self) -> None:
        self._co2_cumulative = 0.0


# Global singleton
_poller: PowerPoller | None = None


def get_poller() -> PowerPoller:
    global _poller
    if _poller is None:
        _poller = PowerPoller()
    return _poller
