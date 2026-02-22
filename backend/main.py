"""
Energent AI — FastAPI Backend Entry Point
All routes: WebSocket, /api/run, /api/predict, /api/carbon, /api/models, /api/hardware, /api/health
"""
import asyncio
import json
import logging
import os
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

import traceback
# ── Internal imports ──────────────────────────────────────────────────────────
from models import (
    WorkloadRunRequest, WorkloadRun, OptimizationSuggestion,
    HardwareProfile, PredictionResult, Alternative,
)
from measurement.poller import get_poller
from measurement.gpu import get_gpu_model, is_rocm_available, FALLBACK_GPU_TDP_W
from measurement.cpu import get_cpu_model, is_rapl_available
from measurement.npu import is_npu_available, get_npu_model
from carbon.electricity_maps import get_carbon_intensity, get_cached_intensity_sync
from carbon.calculator import (
    calculate_energy_wh, calculate_co2_grams,
    calculate_co2_per_1k_calls, calculate_grade, carbon_context,
)
from inference.optimizer import generate_suggestions
from inference.predictor import get_predictor

from database import save_run, get_run, get_history

# ── In-memory stores ──────────────────────────────────────────────────────────
# _runs: dict[str, dict] = {} # Removed in favor of SQLite
_ws_clients: list[WebSocket] = []    # active WebSocket connections
_loop: asyncio.AbstractEventLoop | None = None  # captured at startup for thread-safe broadcast


# ── App lifecycle ─────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _loop
    logger.info("🌱 Energent AI starting up...")

    # Increase thread pool size for anyio (FastAPI's underlying thread pool)
    # Default is 40; we increase to 100 to prevent saturation by BackgroundTasks
    try:
        from anyio.lowlevel import RunVar
        from anyio import CapacityLimiter
        RunVar("_default_thread_limiter").set(CapacityLimiter(100))
        logger.info("✓ Thread pool capacity increased to 100")
    except Exception as e:
        logger.warning(f"Could not increase thread pool: {e}")

    # Capture the running event loop so the poller thread can schedule coroutines
    _loop = asyncio.get_running_loop()

    # Fetch initial carbon intensity
    carbon = await get_carbon_intensity()
    poller = get_poller()
    poller.set_grid_intensity(carbon["intensity_g_kwh"])

    # Register WebSocket broadcast callback — thread-safe via run_coroutine_threadsafe
    def broadcast_reading(reading: dict):
        if _loop and _loop.is_running():
            asyncio.run_coroutine_threadsafe(_broadcast(reading), _loop)

    poller.register_callback(broadcast_reading)
    poller.start()

    # Warm up predictor
    try:
        get_predictor()
        logger.info("✓ PowerPredictor ready")
    except Exception as e:
        logger.warning(f"Predictor init warning: {e}")

    # Refresh carbon intensity every 5 minutes
    asyncio.create_task(_refresh_carbon_loop())

    yield

    poller.stop()
    logger.info("Energent AI shut down")


app = FastAPI(
    title="Energent AI",
    description="Real-time AI workload energy profiler for AMD hardware",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving moved to end of file to avoid route shadowing


# ── Background tasks ──────────────────────────────────────────────────────────
async def _refresh_carbon_loop():
    while True:
        await asyncio.sleep(300)
        try:
            carbon = await get_carbon_intensity()
            get_poller().set_grid_intensity(carbon["intensity_g_kwh"])
        except Exception as e:
            logger.warning(f"Carbon refresh error: {e}")


async def _broadcast(reading: dict):
    if not _ws_clients:
        return
    
    msg = json.dumps(reading)
    tasks = []
    for ws in _ws_clients:
        tasks.append(ws.send_text(msg))
    
    if not tasks:
        return

    # Parallel broadcast to all clients
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    dead = []
    for i, res in enumerate(results):
        if isinstance(res, Exception):
            logger.debug(f"Broadcast failed for client: {res}")
            dead.append(_ws_clients[i])
            
    for ws in dead:
        try:
            if ws in _ws_clients:
                _ws_clients.remove(ws)
        except Exception:
            pass


# ── WebSocket ─────────────────────────────────────────────────────────────────
@app.websocket("/ws/power")
async def ws_power(websocket: WebSocket):
    await websocket.accept()
    _ws_clients.append(websocket)
    client_host = websocket.client.host if websocket.client else "unknown"
    logger.info(f"WebSocket connected from {client_host}. Total clients: {len(_ws_clients)}")
    
    try:
        # Send buffered history on connect
        buffer = get_poller().get_buffer()
        if buffer:
            logger.info(f"Sending {len(buffer)} buffered readings to new client")
            for reading in buffer:
                await websocket.send_text(json.dumps(reading))
        
        # Keep alive - wait for messages or disconnect
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected from {client_host}")
    except Exception as e:
        logger.warning(f"WebSocket error for {client_host}: {e}")
    finally:
        if websocket in _ws_clients:
            _ws_clients.remove(websocket)
        logger.info(f"WebSocket cleaned up. Remaining clients: {len(_ws_clients)}")


# ── POST /api/run ─────────────────────────────────────────────────────────────
@app.post("/api/run")
def start_run(req: WorkloadRunRequest, background_tasks: BackgroundTasks) -> dict:
    logger.info(f"API CALL: POST /api/run (model={req.model})")
    """Trigger a workload run. Returns run_id immediately; run executes in background."""
    run_id = f"run_{uuid.uuid4().hex[:8]}"
    intensity = get_cached_intensity_sync()

    run = {
        "run_id": run_id,
        "model": req.model,
        "task": req.task,
        "precision": req.precision,
        "compute_target": req.compute_target,
        "batch_size": req.batch_size,
        "num_samples": req.num_samples,
        "status": "queued",
        "started_at": int(time.time()),
        "completed_at": None,
        "duration_s": None,
        "avg_watts": None,
        "total_energy_wh": None,
        "co2_g": None,
        "grade": None,
        "grid_intensity": intensity,
        "power_readings": [],
    }
    save_run(run)
    background_tasks.add_task(_execute_run, run_id, req)
    return {"run_id": run_id, "status": "started"}


def _execute_run(run_id: str, req: WorkloadRunRequest):
    run = get_run(run_id)
    if not run:
        return
    run["status"] = "running"
    save_run(run)
    poller = get_poller()
    readings_before = len(poller.get_buffer())

    try:
        from inference.runner import run_inference
        result = run_inference(
            req.model, req.task, req.precision, req.compute_target,
            req.num_samples, req.batch_size,
        )
        duration_s = result["duration_s"]
    except Exception as e:
        logger.error(f"Run {run_id} failed: {e}")
        run["status"] = "failed"
        save_run(run)
        return

    # Collect readings taken during the run
    all_readings = poller.get_buffer()
    run_readings = all_readings[readings_before:]
    if not run_readings:
        run_readings = all_readings[-5:] if all_readings else []

    avg_watts = (
        sum(r["total_watts"] for r in run_readings) / len(run_readings)
        if run_readings else 5.0
    )
    energy_wh = calculate_energy_wh(avg_watts, duration_s)
    grid = run["grid_intensity"]
    co2_g = calculate_co2_grams(energy_wh, grid)
    co2_per_1k = calculate_co2_per_1k_calls(avg_watts, result.get("avg_inference_s", 0.1), grid)
    grade = calculate_grade(co2_per_1k, req.task)

    run.update({
        "status": "complete",
        "completed_at": int(time.time()),
        "duration_s": duration_s,
        "avg_watts": round(avg_watts, 1),
        "total_energy_wh": round(energy_wh, 6),
        "co2_g": round(co2_g, 4),
        "grade": grade,
        "power_readings": run_readings[-60:],
    })
    save_run(run)
    logger.info(f"Run {run_id} complete: {avg_watts:.1f}W, {grade}, {co2_g:.3f}g CO2")


# ── GET /api/run/{run_id} ─────────────────────────────────────────────────────
@app.get("/api/run/{run_id}")
def get_run_endpoint(run_id: str) -> dict:
    logger.info(f"API CALL: GET /api/run/{run_id}")
    try:
        run = get_run(run_id)
        if not run:
            raise HTTPException(404, f"Run not found: {run_id}")
        return run
    except HTTPException:
        raise
    except Exception as e:
        with open("backend_errors.log", "a") as f:
            f.write(f"\n--- Error in get_run_endpoint ({run_id}) ---\n")
            f.write(traceback.format_exc())
        logger.error(f"Error in get_run_endpoint: {e}")
        raise HTTPException(500, detail=str(e))


# ── GET /api/run/{run_id}/optimize ────────────────────────────────────────────
@app.get("/api/run/{run_id}/optimize")
def get_optimizations(run_id: str) -> list[dict]:
    logger.info(f"API CALL: GET /api/run/{run_id}/optimize")
    try:
        run = get_run(run_id)
        if not run:
            raise HTTPException(404, f"Run not found: {run_id}")
        if run["status"] != "complete":
            raise HTTPException(400, "Run not yet complete")
        intensity = get_cached_intensity_sync()
        return generate_suggestions(run, intensity)
    except HTTPException:
        raise
    except Exception as e:
        with open("backend_errors.log", "a") as f:
            f.write(f"\n--- Error in get_optimizations ({run_id}) ---\n")
            f.write(traceback.format_exc())
        logger.error(f"Error in get_optimizations: {e}")
        raise HTTPException(500, detail=str(e))


# ── GET /api/run/{run_id}/export ──────────────────────────────────────────────
@app.get("/api/run/{run_id}/export")
def export_run(run_id: str, format: str = "json"):
    logger.info(f"API CALL: GET /api/run/{run_id}/export")
    try:
        run = get_run(run_id)
        if not run:
            raise HTTPException(404, f"Run not found: {run_id}")
        
        if format == "json":
            return run
        
        if format == "csv":
            # Generate CSV from power readings
            import csv
            import io
            from fastapi.responses import StreamingResponse
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Header
            writer.writerow(["timestamp", "gpu_watts", "cpu_watts", "npu_watts", "total_watts", "gpu_util", "cpu_util"])
            
            # Data rows
            for r in run.get("power_readings", []):
                writer.writerow([
                    r.get("timestamp", ""),
                    r.get("gpu_watts", 0),
                    r.get("cpu_watts", 0),
                    r.get("npu_watts", 0),
                    r.get("total_watts", 0),
                    r.get("gpu_utilization_pct", 0),
                    r.get("cpu_utilization_pct", 0),
                ])
                
            output.seek(0)
            return StreamingResponse(
                io.BytesIO(output.getvalue().encode()),
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename={run_id}.csv"}
            )

        raise HTTPException(400, "Unsupported format. Use 'json' or 'csv'.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in export_run: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(500, detail=str(e))


# ── GET /api/predict ──────────────────────────────────────────────────────────
@app.get("/api/predict")
def predict_power(
    model_id: str = Query(...),
    compute_target: str = Query("gpu"),
    precision: str = Query("FP32"),
    batch_size: int = Query(1),
    accuracy_min_pct: float = Query(90.0),
) -> dict:
    logger.info(f"API CALL: GET /api/predict?model_id={model_id}")
    """Predict energy BEFORE a run. Returns in <50ms. Fires on every model dropdown change."""
    try:
        predictor = get_predictor()

        try:
            pred = predictor.predict(model_id, compute_target, precision)
        except ValueError as e:
            raise HTTPException(404, str(e))

        grid = get_cached_intensity_sync()

        avg_inference_s = 0.1
        co2_per_1k = calculate_co2_per_1k_calls(pred["predicted_watts"], avg_inference_s, grid)

        import json, os
        model_map = predictor.model_map
        current_profile = model_map.get(model_id, {})
        task = current_profile.get("task", "NLP")

        grade = calculate_grade(co2_per_1k, task)

        # Build alternatives with CO2 context
        alts = []
        for a in pred["alternatives"]:
            alt_co2 = calculate_co2_per_1k_calls(a["predicted_watts"], avg_inference_s, grid)
            co2_saved = co2_per_1k - alt_co2
            alts.append({
                **a,
                "co2_saved_per_1k": round(co2_saved, 4),
            })

        best = alts[0] if alts else None

        return {
            "predicted_watts": pred["predicted_watts"],
            "predicted_co2_per_1k": round(co2_per_1k, 4),
            "predicted_grade": grade,
            "confidence": pred["confidence"],
            "alternatives": alts,
            "best_alternative": best,
            "carbon_context": carbon_context(co2_per_1k),
        }
    except Exception as e:
        with open("backend_errors.log", "a") as f:
            f.write(f"\n--- Error in predict_power ({model_id}) ---\n")
            f.write(traceback.format_exc())
        logger.error(f"Error in predict_power: {e}")
        raise HTTPException(500, detail=str(e))


# ── GET /api/carbon/intensity ─────────────────────────────────────────────────
@app.get("/api/carbon/intensity")
def get_carbon() -> dict:
    logger.info("API CALL: GET /api/carbon/intensity")
    return {"intensity_g_kwh": get_cached_intensity_sync(), "source": "cached"}


# ── GET /api/models ───────────────────────────────────────────────────────────
@app.get("/api/models")
def get_models() -> list[dict]:
    logger.info("API CALL: /api/models")
    try:
        import json, os
        db_path = os.path.join(os.path.dirname(__file__), "data", "models_db.json")
        with open(db_path) as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error in get_models: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(500, detail=str(e))


# ── GET /api/hardware ─────────────────────────────────────────────────────────
@app.get("/api/hardware")
def get_hardware() -> dict:
    logger.info("API CALL: /api/hardware")
    try:
        import platform
        return {
            "gpu_model": get_gpu_model(),
            "gpu_tdp_w": FALLBACK_GPU_TDP_W,
            "gpu_vram_gb": None,
            "npu_available": is_npu_available(),
            "npu_model": get_npu_model(),
            "cpu_model": get_cpu_model(),
            "cpu_tdp_w": 45.0,
            "rocm_version": None,
            "rocm_smi_available": is_rocm_available(),
            "rapl_available": is_rapl_available(),
            "platform": platform.system(),
        }
    except Exception as e:
        logger.error(f"Error in get_hardware: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(500, detail=str(e))


# ── GET /api/runs/history ─────────────────────────────────────────────────────
@app.get("/api/runs/history")
def get_history_endpoint() -> list[dict]:
    logger.info("API CALL: GET /api/runs/history")
    try:
        return get_history(20)
    except Exception as e:
        logger.error(f"Error in get_history_endpoint: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(500, detail=str(e))


# ── GET /api/validate ─────────────────────────────────────────────────────────
@app.get("/api/validate")
def get_validation() -> dict:
    logger.info("API CALL: GET /api/validate")
    """
    Returns pre-run prediction accuracy results.
    Judges can call this live to verify prediction credibility.
    """
    import json, os
    results_path = os.path.join(os.path.dirname(__file__), "validation_results.json")
    if os.path.exists(results_path):
        with open(results_path) as f:
            return json.load(f)
    # If not yet run, return placeholder
    return {
        "generated_at": None,
        "avg_error_pct": None,
        "results": [],
        "message": "Run `python validation.py` to generate accuracy data",
    }


# ── GET /api/health ───────────────────────────────────────────────────────────
@app.get("/api/health")
def health() -> dict:
    logger.info("API CALL: GET /api/health")
    intensity = get_cached_intensity_sync()
    return {
        "status": "ok",
        "app": "Energent AI",
        "rocm_smi": is_rocm_available(),
        "rapl": is_rapl_available(),
        "npu": is_npu_available(),
        "electricity_maps": True,
        "carbon_intensity_g_kwh": intensity,
        "carbon_source": "cached",
        "active_ws_clients": len(_ws_clients),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5001))
    logger.info(f"🚀 Starting Energent AI on http://0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
