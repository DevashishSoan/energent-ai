"""
Electricity Maps API client with 5-minute cache.
Falls back to hardcoded 0.82 kg CO2/kWh (820 g/kWh) for India if API unavailable.
"""
import time
import logging
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

ELECTRICITY_MAPS_URL = "https://api.electricitymap.org/v3/carbon-intensity/latest"
CACHE_TTL_S = 300  # 5 minutes
FALLBACK_INTENSITY = 820.0  # g CO2/kWh — India average

_cache: dict | None = None
_cache_expires: float = 0.0


async def get_carbon_intensity(zone: str = "IN") -> dict:
    """
    Returns dict with keys: intensity_g_kwh, zone, source, fetched_at, expires_at.
    Uses 5-minute cache. Falls back to 820 g/kWh if API unavailable.
    """
    global _cache, _cache_expires

    now = time.time()
    if _cache and now < _cache_expires:
        return _cache

    api_key = os.getenv("ELECTRICITY_MAPS_API_KEY", "")
    if not api_key or api_key == "your_free_key_here":
        logger.info("No Electricity Maps API key — using fallback intensity")
        return _make_fallback(zone, now)

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                ELECTRICITY_MAPS_URL,
                params={"zone": zone},
                headers={"auth-token": api_key},
            )
            resp.raise_for_status()
            data = resp.json()
            intensity = float(data.get("carbonIntensity", FALLBACK_INTENSITY))
            _cache = {
                "intensity_g_kwh": intensity,
                "zone": zone,
                "source": "live",
                "fetched_at": int(now),
                "expires_at": int(now + CACHE_TTL_S),
            }
            _cache_expires = now + CACHE_TTL_S
            logger.info(f"Carbon intensity fetched: {intensity} g/kWh ({zone})")
            return _cache
    except Exception as e:
        logger.warning(f"Electricity Maps API error: {e} — using fallback")
        # Use last cache if available, else fallback
        if _cache:
            return _cache
        return _make_fallback(zone, now)


def _make_fallback(zone: str, now: float) -> dict:
    return {
        "intensity_g_kwh": FALLBACK_INTENSITY,
        "zone": zone,
        "source": "fallback",
        "fetched_at": int(now),
        "expires_at": int(now + CACHE_TTL_S),
    }


def get_cached_intensity_sync() -> float:
    """Synchronous accessor for the cached intensity value (used by poller thread)."""
    if _cache:
        return _cache["intensity_g_kwh"]
    return FALLBACK_INTENSITY
