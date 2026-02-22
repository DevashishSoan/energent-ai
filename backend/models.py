"""
Energent AI — All Pydantic Data Models
Covers: PowerReading, WorkloadRun, OptimizationSuggestion, ModelProfile,
        CarbonData, HardwareProfile, PredictionRequest, Alternative, PredictionResult
"""
from __future__ import annotations
from typing import Optional, Literal
from pydantic import BaseModel


# ─────────────────────────────────────────────
# 1. Hardware Measurement
# ─────────────────────────────────────────────

class PowerReading(BaseModel):
    """Live hardware data — produced every 1 second by the poller."""
    gpu_watts: float = 0.0
    cpu_watts: float = 0.0
    npu_watts: Optional[float] = None
    total_watts: float = 0.0
    gpu_utilization_pct: float = 0.0
    cpu_utilization_pct: float = 0.0
    npu_utilization_pct: Optional[float] = None
    timestamp: int = 0
    co2_g_cumulative: float = 0.0
    source: Literal["live", "estimated"] = "estimated"


class HardwareProfile(BaseModel):
    """Device hardware detection — populated at startup."""
    gpu_model: Optional[str] = None
    gpu_tdp_w: Optional[float] = None
    gpu_vram_gb: Optional[float] = None
    npu_available: bool = False
    npu_model: Optional[str] = None
    cpu_model: str = "Unknown CPU"
    cpu_tdp_w: float = 45.0
    rocm_version: Optional[str] = None
    rocm_smi_available: bool = False
    rapl_available: bool = False


# ─────────────────────────────────────────────
# 2. Carbon Data
# ─────────────────────────────────────────────

class CarbonData(BaseModel):
    """Grid intensity cache — fetched from Electricity Maps API."""
    intensity_g_kwh: float = 820.0
    zone: str = "IN"
    fetched_at: int = 0
    source: Literal["live", "fallback"] = "fallback"
    expires_at: int = 0


# ─────────────────────────────────────────────
# 3. Model Database
# ─────────────────────────────────────────────

class ModelProfile(BaseModel):
    """One entry in models_db.json — energy profile for a supported model."""
    model_id: str
    display_name: str
    task: Literal["NLP", "Vision", "LLM", "Multimodal"]
    params_millions: float
    flops_relative: float          # 1.0 = BERT-large baseline
    typical_tdp_fraction: float    # fraction of GPU TDP consumed
    accuracy_vs_bert: float        # accuracy delta vs BERT-large (GLUE SST-2)
    supports_int8: bool
    npu_compatible: bool
    download_size_mb: float


# ─────────────────────────────────────────────
# 4. Optimization
# ─────────────────────────────────────────────

class OptimizationSuggestion(BaseModel):
    """One ranked optimization suggestion generated after a run."""
    suggestion_id: str
    type: Literal["model_swap", "precision", "compute_route", "batch_size"]
    title: str
    current_config: str
    suggested_config: str
    energy_saving_pct: float
    co2_saved_per_1k_calls: float
    accuracy_delta_pct: float
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    implementation_steps: list[str]
    source: Literal["model_db", "measured"] = "model_db"


# ─────────────────────────────────────────────
# 5. Workload Run
# ─────────────────────────────────────────────

class WorkloadRunRequest(BaseModel):
    """Request body for POST /api/run."""
    model: str
    task: str
    precision: Literal["FP32", "FP16", "INT8"] = "FP32"
    compute_target: Literal["gpu", "cpu", "npu"] = "gpu"
    batch_size: int = 1
    num_samples: int = 100


class WorkloadRun(BaseModel):
    """Full run profile — created on POST /api/run, updated as run progresses."""
    run_id: str
    model: str
    task: str
    precision: str
    compute_target: str
    batch_size: int
    num_samples: int
    status: Literal["queued", "running", "complete", "failed"] = "queued"
    started_at: int = 0
    completed_at: Optional[int] = None
    duration_s: Optional[float] = None
    avg_watts: Optional[float] = None
    total_energy_wh: Optional[float] = None
    co2_g: Optional[float] = None
    grade: Optional[str] = None
    grid_intensity: float = 820.0
    power_readings: list[PowerReading] = []


# ─────────────────────────────────────────────
# 6. Predictive AI (PreOpt)
# ─────────────────────────────────────────────

class PredictionRequest(BaseModel):
    """Query params for GET /api/predict."""
    model_id: str
    compute_target: Literal["gpu", "cpu", "npu"] = "gpu"
    precision: Literal["FP32", "FP16", "INT8"] = "FP32"
    batch_size: int = 1
    accuracy_min_pct: float = 90.0


class Alternative(BaseModel):
    """A predicted better option returned by the PreOpt engine."""
    model_id: str
    display_name: str
    predicted_watts: float
    saving_pct: float
    accuracy_delta: float
    compute_target: str
    precision: str
    co2_saved_per_1k: float
    confidence: Literal["HIGH", "MEDIUM", "LOW"]


class PredictionResult(BaseModel):
    """Full response from GET /api/predict."""
    predicted_watts: float
    predicted_co2_per_1k: float
    predicted_grade: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]
    alternatives: list[Alternative]
    best_alternative: Optional[Alternative] = None
    carbon_context: dict[str, float] = {}
