"""
Rule-based optimization engine.
Analyzes completed run profiles against models_db.json and generates
ranked OptimizationSuggestion objects.
"""
import json
import os
import uuid
import logging
from typing import Any

logger = logging.getLogger(__name__)

_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "models_db.json")
_MODELS_DB: list[dict] | None = None


def _load_db() -> list[dict]:
    global _MODELS_DB
    if _MODELS_DB is None:
        with open(_DB_PATH) as f:
            _MODELS_DB = json.load(f)
    return _MODELS_DB


def generate_suggestions(run: dict, grid_intensity: float = 820.0) -> list[dict]:
    """
    Given a completed WorkloadRun dict, return ranked list of OptimizationSuggestion dicts.
    Covers: model_swap, precision, compute_route, batch_size.
    """
    db = _load_db()
    model_map = {m["model_id"]: m for m in db}

    current_model = model_map.get(run.get("model", ""))
    avg_watts = run.get("avg_watts", 0.0) or 0.0
    precision = run.get("precision", "FP32")
    compute = run.get("compute_target", "gpu")
    task = run.get("task", "NLP")
    batch_size = run.get("batch_size", 1)

    suggestions = []

    # ── 1. Model Swap ──────────────────────────────────────────────────────────
    if current_model:
        for alt in db:
            if alt["model_id"] == run.get("model"):
                continue
            if alt["task"] != current_model["task"]:
                continue
            # Estimate alt watts relative to current
            ratio = alt["flops_relative"] / max(current_model["flops_relative"], 0.01)
            alt_watts = avg_watts * ratio
            saving_pct = (avg_watts - alt_watts) / max(avg_watts, 0.01) * 100
            if saving_pct < 10:
                continue

            co2_saved = _co2_saved_per_1k(avg_watts, alt_watts, grid_intensity)
            priority = "HIGH" if saving_pct >= 50 else ("MEDIUM" if saving_pct >= 25 else "LOW")
            suggestions.append({
                "suggestion_id": f"sug_{uuid.uuid4().hex[:6]}",
                "type": "model_swap",
                "title": f"Switch to {alt['display_name']}",
                "current_config": f"{current_model['display_name']} ({avg_watts:.1f}W)",
                "suggested_config": f"{alt['display_name']} (~{alt_watts:.1f}W)",
                "energy_saving_pct": round(saving_pct, 1),
                "co2_saved_per_1k_calls": round(co2_saved, 2),
                "accuracy_delta_pct": round(alt.get("accuracy_delta", 0.0) - current_model.get("accuracy_delta", 0.0), 2),
                "priority": priority,
                "implementation_steps": [
                    f"Replace model_id with '{alt['model_id']}'",
                    "Re-run inference with updated config",
                ],
                "source": "model_db",
            })

    # ── 2. Precision Reduction ─────────────────────────────────────────────────
    precision_savings = {"FP32": {"FP16": 0.30, "INT8": 0.55}, "FP16": {"INT8": 0.25}}
    for target_prec, saving_frac in precision_savings.get(precision, {}).items():
        if current_model and not current_model.get("supports_int8") and target_prec == "INT8":
            continue
        alt_watts = avg_watts * (1 - saving_frac)
        saving_pct = saving_frac * 100
        co2_saved = _co2_saved_per_1k(avg_watts, alt_watts, grid_intensity)
        suggestions.append({
            "suggestion_id": f"sug_{uuid.uuid4().hex[:6]}",
            "type": "precision",
            "title": f"Reduce precision to {target_prec}",
            "current_config": f"{precision} ({avg_watts:.1f}W)",
            "suggested_config": f"{target_prec} (~{alt_watts:.1f}W)",
            "energy_saving_pct": round(saving_pct, 1),
            "co2_saved_per_1k_calls": round(co2_saved, 2),
            "accuracy_delta_pct": -0.5 if target_prec == "FP16" else -1.5,
            "priority": "HIGH" if saving_pct >= 40 else "MEDIUM",
            "implementation_steps": [
                f"Set precision='{target_prec}' in run config",
                "pip install onnxruntime optimum[onnxruntime]" if target_prec == "INT8" else "",
                "Re-run inference",
            ],
            "source": "model_db",
        })

    # ── 3. Compute Route (GPU → NPU) ───────────────────────────────────────────
    if compute == "gpu" and current_model and current_model.get("npu_compatible"):
        npu_watts = avg_watts * 0.17  # NPU ~83% more efficient for compatible models
        saving_pct = 83.0
        co2_saved = _co2_saved_per_1k(avg_watts, npu_watts, grid_intensity)
        suggestions.append({
            "suggestion_id": f"sug_{uuid.uuid4().hex[:6]}",
            "type": "compute_route",
            "title": "Route to AMD NPU",
            "current_config": f"GPU ({avg_watts:.1f}W)",
            "suggested_config": f"AMD NPU (~{npu_watts:.1f}W)",
            "energy_saving_pct": round(saving_pct, 1),
            "co2_saved_per_1k_calls": round(co2_saved, 2),
            "accuracy_delta_pct": 0.0,
            "priority": "HIGH",
            "implementation_steps": [
                "Set compute_target='npu' in run config",
                "Ensure ONNX Runtime with DirectML/XDNA backend installed",
                "Verify model is NPU-compatible (INT8 ONNX format required)",
            ],
            "source": "model_db",
        })

    # ── 4. Batch Size Optimization ─────────────────────────────────────────────
    if batch_size == 1:
        batched_watts = avg_watts * 1.15  # slight increase in total power
        energy_per_sample_saving = 0.30   # ~30% less energy per sample
        suggestions.append({
            "suggestion_id": f"sug_{uuid.uuid4().hex[:6]}",
            "type": "batch_size",
            "title": "Increase batch size to 8",
            "current_config": f"batch_size=1 ({avg_watts:.1f}W total)",
            "suggested_config": f"batch_size=8 (~{batched_watts:.1f}W, {energy_per_sample_saving*100:.0f}% less per sample)",
            "energy_saving_pct": round(energy_per_sample_saving * 100, 1),
            "co2_saved_per_1k_calls": round(_co2_saved_per_1k(avg_watts, avg_watts * 0.7, grid_intensity), 2),
            "accuracy_delta_pct": 0.0,
            "priority": "MEDIUM",
            "implementation_steps": [
                "Set batch_size=8 in run config",
                "Ensure sufficient GPU/NPU memory for larger batch",
            ],
            "source": "model_db",
        })

    # Sort by energy saving descending
    suggestions.sort(key=lambda s: s["energy_saving_pct"], reverse=True)
    return suggestions[:6]


def _co2_saved_per_1k(current_w: float, alt_w: float, grid_g_kwh: float) -> float:
    """CO2 grams saved per 1000 inference calls (assuming 0.1s per call)."""
    avg_inference_s = 0.1
    current_energy_wh = current_w * (avg_inference_s / 3600)
    alt_energy_wh = alt_w * (avg_inference_s / 3600)
    return (current_energy_wh - alt_energy_wh) * 1000 * (grid_g_kwh / 1000)
