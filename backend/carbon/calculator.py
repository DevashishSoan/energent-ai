"""
Carbon footprint calculator.
Formula: Energy(Wh) = Power(W) × Time(h)
         CO2(g) = Energy(Wh) × GridIntensity(g/Wh)
"""
import json
import os
import logging

logger = logging.getLogger(__name__)

_GRADE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "grade_thresholds.json")
_grade_thresholds: dict | None = None


def _load_thresholds() -> dict:
    global _grade_thresholds
    if _grade_thresholds is None:
        with open(_GRADE_FILE, "r") as f:
            _grade_thresholds = json.load(f)
    return _grade_thresholds


def calculate_energy_wh(avg_watts: float, duration_s: float) -> float:
    """Energy consumed in watt-hours."""
    return avg_watts * (duration_s / 3600.0)


def calculate_co2_grams(energy_wh: float, grid_intensity_g_kwh: float) -> float:
    """CO2 in grams: energy_wh × (intensity_g_kwh / 1000)."""
    return energy_wh * (grid_intensity_g_kwh / 1000.0)


def calculate_co2_per_1k_calls(
    avg_watts: float,
    avg_inference_s: float = 0.1,
    grid_intensity_g_kwh: float = 820.0,
) -> float:
    """Predicted CO2 grams per 1000 inference calls."""
    energy_per_call_wh = avg_watts * (avg_inference_s / 3600.0)
    co2_per_call = energy_per_call_wh * (grid_intensity_g_kwh / 1000.0)
    return round(co2_per_call * 1000, 4)


def calculate_grade(co2_per_1k: float, task: str) -> str:
    """Return efficiency grade A+ to F based on CO2 per 1k calls and task type."""
    thresholds = _load_thresholds()
    task_thresholds = thresholds.get(task, thresholds["NLP"])
    for grade, max_co2 in task_thresholds.items():
        if co2_per_1k <= max_co2:
            return grade
    return "F"


def carbon_context(co2_g: float) -> dict[str, float]:
    """
    Translate CO2 grams into relatable real-world equivalents.
    Sources: EPA / IPCC standard conversion factors.
    """
    return {
        "km_driven": round(co2_g / 210.0, 4),       # 210g CO2/km petrol car
        "phone_charges": round(co2_g / 8.22, 3),     # 8.22g CO2 per phone charge
        "tree_hours": round(co2_g / 10.5, 3),         # 10.5g CO2 absorbed per tree per hour
        "led_hours": round(co2_g / 5.5, 3),           # 5.5g CO2 per LED bulb hour
    }
