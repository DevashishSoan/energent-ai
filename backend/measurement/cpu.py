"""
CPU power measurement via Linux RAPL interface.
Falls back to psutil CPU% × TDP estimate on non-Linux or systems without RAPL.
"""
import os
import time
import psutil
import platform
import logging

logger = logging.getLogger(__name__)

RAPL_BASE = "/sys/class/powercap/intel-rapl/intel-rapl:0/energy_uj"
FALLBACK_CPU_TDP_W = 45.0

_last_energy_uj: float | None = None
_last_energy_time: float | None = None

# ── Metadata Cache ──────────────────────────────────────────────────────────
_cpu_model_cache: str | None = None
_rapl_available_cache: bool | None = None


def _read_rapl_energy_uj() -> float | None:
    """Read current CPU energy in microjoules from RAPL sysfs."""
    try:
        with open(RAPL_BASE, "r") as f:
            return float(f.read().strip())
    except (FileNotFoundError, PermissionError, OSError):
        return None


def read_cpu_power() -> tuple[float, float, bool]:
    """
    Returns (cpu_watts, cpu_utilization_pct, is_live).
    Uses RAPL delta method for accurate power; falls back to TDP estimate.
    """
    global _last_energy_uj, _last_energy_time

    cpu_pct = psutil.cpu_percent(interval=None)

    # Try RAPL (Linux only)
    if platform.system() == "Linux":
        current_energy = _read_rapl_energy_uj()
        current_time = time.monotonic()

        if current_energy is not None:
            if _last_energy_uj is not None and _last_energy_time is not None:
                delta_uj = current_energy - _last_energy_uj
                # Handle counter wrap-around
                if delta_uj < 0:
                    delta_uj += 2**32
                delta_s = current_time - _last_energy_time
                if delta_s > 0:
                    watts = (delta_uj / 1_000_000) / delta_s  # µJ → J → W
                    _last_energy_uj = current_energy
                    _last_energy_time = current_time
                    return round(watts, 1), cpu_pct, True

            _last_energy_uj = current_energy
            _last_energy_time = current_time

    # Fallback: TDP × utilization
    estimated_watts = FALLBACK_CPU_TDP_W * (cpu_pct / 100.0)
    return round(estimated_watts, 1), cpu_pct, False


def get_cpu_model() -> str:
    """Return CPU model string. (Cached)"""
    global _cpu_model_cache
    if _cpu_model_cache is not None:
        return _cpu_model_cache

    if platform.system() == "Linux":
        try:
            with open("/proc/cpuinfo", "r") as f:
                for line in f:
                    if "model name" in line:
                        _cpu_model_cache = line.split(":")[1].strip()
                        return _cpu_model_cache
        except Exception:
            pass
    
    _cpu_model_cache = platform.processor() or "Unknown CPU"
    return _cpu_model_cache


def is_rapl_available() -> bool:
    """Check if Linux RAPL interface is accessible. (Cached)"""
    global _rapl_available_cache
    if _rapl_available_cache is not None:
        return _rapl_available_cache

    _rapl_available_cache = os.path.exists(RAPL_BASE) and os.access(RAPL_BASE, os.R_OK)
    return _rapl_available_cache
