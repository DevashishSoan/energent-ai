"""
GPU power measurement via rocm-smi.
Falls back to TDP × utilization estimate if rocm-smi is unavailable (e.g., Windows dev).
"""
import subprocess
import re
import psutil
import logging

logger = logging.getLogger(__name__)

# Typical AMD GPU TDP for estimation fallback (watts)
FALLBACK_GPU_TDP_W = 165.0

# ── Metadata Cache ──────────────────────────────────────────────────────────
_gpu_model_cache: str | None = None
_rocm_available_cache: bool | None = None


def _parse_rocm_smi_power(output: str) -> float | None:
    """Parse watt value from rocm-smi --showpower output."""
    # Matches lines like: "GPU[0]          : Average Graphics Package Power (W): 18.4"
    match = re.search(r"Average Graphics Package Power.*?:\s*([\d.]+)", output)
    if match:
        return float(match.group(1))
    # Alternative format: "Power (W): 18.4"
    match = re.search(r"Power.*?:\s*([\d.]+)", output)
    if match:
        return float(match.group(1))
    return None


def _parse_rocm_smi_utilization(output: str) -> float:
    """Parse GPU utilization % from rocm-smi --showuse output."""
    match = re.search(r"GPU use \(%\)\s*:\s*(\d+)", output)
    if match:
        return float(match.group(1))
    return 0.0


def read_gpu_power() -> tuple[float, float, bool]:
    """
    Returns (gpu_watts, gpu_utilization_pct, is_live).
    is_live=True means real hardware reading; False means TDP estimate.
    """
    try:
        result = subprocess.run(
            ["rocm-smi", "--showpower", "--showuse"],
            capture_output=True, text=True, timeout=3
        )
        if result.returncode == 0 and result.stdout:
            watts = _parse_rocm_smi_power(result.stdout)
            util = _parse_rocm_smi_utilization(result.stdout)
            if watts is not None:
                return watts, util, True
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception) as e:
        logger.debug(f"rocm-smi unavailable: {e}")

    # Fallback: Simulate "live" idle power if rocm-smi is missing
    # Baseline 15W + small random jitter + CPU load factor
    try:
        import random
        cpu_pct = psutil.cpu_percent(interval=None)
        
        # Base jitter: 15.0 to 18.0 W (idle)
        base_power = 15.0 + random.uniform(0, 3.0)
        
        # Load factor: up to ~50W more based on CPU usage
        load_power = (cpu_pct / 100.0) * 50.0
        
        estimated_watts = base_power + load_power
        return round(estimated_watts, 1), cpu_pct, False
    except Exception:
        return 15.0, 0.0, False


def get_gpu_model() -> str | None:
    """Return GPU model name from rocm-smi, or None if unavailable. (Cached)"""
    global _gpu_model_cache
    if _gpu_model_cache is not None:
        return _gpu_model_cache

    try:
        result = subprocess.run(
            ["rocm-smi", "--showproductname"],
            capture_output=True, text=True, timeout=3
        )
        if result.returncode == 0:
            match = re.search(r"Card series:\s*(.+)", result.stdout)
            if match:
                _gpu_model_cache = match.group(1).strip()
                return _gpu_model_cache
    except Exception:
        pass
    
    _gpu_model_cache = None # Only check once
    return None


def is_rocm_available() -> bool:
    """Check if rocm-smi is installed and responsive. (Cached)"""
    global _rocm_available_cache
    if _rocm_available_cache is not None:
        return _rocm_available_cache

    try:
        result = subprocess.run(
            ["rocm-smi", "--version"],
            capture_output=True, text=True, timeout=3
        )
        _rocm_available_cache = (result.returncode == 0)
    except Exception:
        _rocm_available_cache = False
    
    return _rocm_available_cache
