"""
Predictive Optimization AI (PreOpt) — the finalist feature.
Trains a LinearRegression model on models_db.json at startup (<100ms).
Predicts energy consumption BEFORE a run executes.
"""
import json
import os
import logging
import numpy as np
from sklearn.linear_model import LinearRegression

logger = logging.getLogger(__name__)

_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "models_db.json")

PRECISION_ORD = {"FP32": 0.0, "FP16": 0.6, "INT8": 1.0}
COMPUTE_TARGETS = ["gpu", "cpu", "npu"]

# Assumed hardware TDP for estimation (watts)
DEFAULT_GPU_TDP = 165.0
DEFAULT_CPU_TDP = 45.0
DEFAULT_NPU_TDP = 15.0


class PowerPredictor:
    """
    LinearRegression-based energy predictor trained on models_db.json.
    Trains at startup in <100ms. Predicts in <1ms.
    """

    def __init__(self, gpu_tdp_w: float = DEFAULT_GPU_TDP):
        self.gpu_tdp_w = gpu_tdp_w
        self.models_db: list[dict] = []
        self.model_map: dict[str, dict] = {}
        self._regressor = LinearRegression()
        self._trained = False
        self._load_and_train()

    def _load_and_train(self) -> None:
        with open(_DB_PATH) as f:
            self.models_db = json.load(f)
        self.model_map = {m["model_id"]: m for m in self.models_db}

        X, y = [], []
        for m in self.models_db:
            for compute_idx, compute in enumerate(COMPUTE_TARGETS):
                for prec_str, prec_ord in PRECISION_ORD.items():
                    # Skip NPU for non-compatible models
                    if compute == "npu" and not m.get("npu_compatible"):
                        continue
                    # Skip INT8 for non-supporting models
                    if prec_str == "INT8" and not m.get("supports_int8"):
                        continue

                    is_gpu = 1.0 if compute == "gpu" else 0.0
                    is_cpu = 1.0 if compute == "cpu" else 0.0
                    is_npu = 1.0 if compute == "npu" else 0.0

                    # Estimated watts based on TDP fractions
                    if compute == "gpu":
                        base_w = m["flops_relative"] * self.gpu_tdp_w * m["typical_tdp_fraction"]
                    elif compute == "cpu":
                        base_w = m["flops_relative"] * DEFAULT_CPU_TDP * m["typical_tdp_fraction"] * 0.8
                    else:  # npu
                        base_w = m["flops_relative"] * DEFAULT_NPU_TDP * m["typical_tdp_fraction"] * 0.5

                    # Precision reduction factor
                    precision_factor = 1.0 - (prec_ord * 0.45)
                    target_w = base_w * precision_factor

                    X.append([
                        m["flops_relative"],
                        m["typical_tdp_fraction"],
                        is_gpu, is_cpu, is_npu,
                        prec_ord,
                    ])
                    y.append(target_w)

        if X:
            self._regressor.fit(np.array(X), np.array(y))
            self._trained = True
            logger.info(f"PowerPredictor trained on {len(X)} data points")

    def predict(
        self,
        model_id: str,
        compute_target: str = "gpu",
        precision: str = "FP32",
        include_alternatives: bool = True,
    ) -> dict:
        """
        Predict energy for a given model/compute/precision config.
        Returns dict with predicted_watts, confidence, alternatives.
        """
        profile = self.model_map.get(model_id)
        if not profile:
            raise ValueError(f"Model not in DB: {model_id}")

        prec_ord = PRECISION_ORD.get(precision, 0.0)
        is_gpu = 1.0 if compute_target == "gpu" else 0.0
        is_cpu = 1.0 if compute_target == "cpu" else 0.0
        is_npu = 1.0 if compute_target == "npu" else 0.0

        x = np.array([[
            profile["flops_relative"],
            profile["typical_tdp_fraction"],
            is_gpu, is_cpu, is_npu,
            prec_ord,
        ]])

        if self._trained:
            watts = float(self._regressor.predict(x)[0])
        else:
            # Fallback: simple formula
            watts = profile["flops_relative"] * self.gpu_tdp_w * profile["typical_tdp_fraction"]

        watts = max(0.5, round(watts, 1))
        confidence = "HIGH" if model_id in self.model_map else "MEDIUM"

        alternatives = []
        if include_alternatives:
            alternatives = self._rank_alternatives(profile, watts)

        return {
            "predicted_watts": watts,
            "confidence": confidence,
            "alternatives": alternatives,
        }

    def _rank_alternatives(self, current: dict, current_watts: float) -> list[dict]:
        """Return top 3 alternatives sorted by energy saving %."""
        alts = []
        for model_id, profile in self.model_map.items():
            if model_id == current["model_id"]:
                continue
            if profile["task"] != current["task"]:
                continue

            # Predict best possible config for this alternative
            best_compute = "npu" if profile.get("npu_compatible") else "gpu"
            best_precision = "INT8" if profile.get("supports_int8") else "FP32"

            try:
                # Use include_alternatives=False to prevent infinite recursion
                alt_pred = self.predict(model_id, best_compute, best_precision, include_alternatives=False)
                alt_watts = alt_pred["predicted_watts"]
            except Exception:
                continue

            saving_pct = (current_watts - alt_watts) / max(current_watts, 0.01) * 100
            if saving_pct < 5:
                continue

            alts.append({
                "model_id": model_id,
                "display_name": profile["display_name"],
                "predicted_watts": alt_watts,
                "saving_pct": round(saving_pct, 1),
                "accuracy_delta": profile["accuracy_delta"] - current["accuracy_delta"],
                "compute_target": best_compute,
                "precision": best_precision,
                "confidence": "HIGH",
            })

        alts.sort(key=lambda a: a["saving_pct"], reverse=True)
        return alts[:3]


# Global singleton — initialized at app startup
_predictor: PowerPredictor | None = None


def get_predictor() -> PowerPredictor:
    global _predictor
    if _predictor is None:
        _predictor = PowerPredictor()
    return _predictor
