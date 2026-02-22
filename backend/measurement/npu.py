"""
AMD NPU power monitoring via ryzen_monitor.
Returns None on all non-NPU hardware — UI hides NPU bar gracefully.
"""
import subprocess
import re
import logging

logger = logging.getLogger(__name__)

# ── Metadata Cache ──────────────────────────────────────────────────────────
_npu_model_cache: str | None = None
_npu_available_cache: bool | None = None


def read_npu_power() -> tuple[float | None, float | None, bool]:
    """
    Returns (npu_watts, npu_utilization_pct, is_live).
    Returns (None, None, False) if NPU not available.
    """
    try:
        result = subprocess.run(
            ["ryzen_monitor", "--npu"],
            capture_output=True, text=True, timeout=3
        )
        if result.returncode == 0 and result.stdout:
            watts = _parse_npu_power(result.stdout)
            util = _parse_npu_util(result.stdout)
            if watts is not None:
                return watts, util, True
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception) as e:
        logger.debug(f"ryzen_monitor unavailable: {e}")

    return None, None, False


def _parse_npu_power(output: str) -> float | None:
    match = re.search(r"NPU.*?Power.*?:\s*([\d.]+)", output, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None


def _parse_npu_util(output: str) -> float | None:
    match = re.search(r"NPU.*?Util.*?:\s*([\d.]+)", output, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None


def is_npu_available() -> bool:
    """Check if AMD Ryzen AI NPU is accessible via ryzen_monitor. (Cached)"""
    global _npu_available_cache
    if _npu_available_cache is not None:
        return _npu_available_cache

    try:
        result = subprocess.run(
            ["ryzen_monitor", "--version"],
            capture_output=True, text=True, timeout=3
        )
        _npu_available_cache = (result.returncode == 0)
    except Exception:
        _npu_available_cache = False
    
    return _npu_available_cache


def get_npu_model() -> str | None:
    """Return NPU-containing processor model name if available. (Cached)"""
    global _npu_model_cache
    if _npu_model_cache is not None:
        return _npu_model_cache

    try:
        result = subprocess.run(
            ["ryzen_monitor", "--info"],
            capture_output=True, text=True, timeout=3
        )
        if result.returncode == 0:
            match = re.search(r"Processor:\s*(.+)", result.stdout)
            if match:
                _npu_model_cache = match.group(1).strip()
                return _npu_model_cache
    except Exception:
        pass
    
    _npu_model_cache = None
    return None
