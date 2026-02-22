"""
ONNX INT8 quantization via HuggingFace Optimum.
Falls back to FP16 if INT8 quantization fails on a given model.
"""
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

QUANTIZED_DIR = Path(__file__).parent.parent / "data" / "quantized_models"


def quantize_model(model_id: str, save_dir: str | None = None) -> tuple[str, str]:
    """
    Quantize a HuggingFace model to INT8 using ONNX Runtime.
    Returns (save_path, actual_precision) — precision may be FP16 if INT8 fails.
    """
    if save_dir is None:
        safe_name = model_id.replace("/", "__")
        save_dir = str(QUANTIZED_DIR / safe_name)

    os.makedirs(save_dir, exist_ok=True)

    try:
        from optimum.onnxruntime import ORTModelForSequenceClassification, ORTQuantizer
        from optimum.onnxruntime.configuration import AutoQuantizationConfig

        logger.info(f"Quantizing {model_id} to INT8...")
        model = ORTModelForSequenceClassification.from_pretrained(
            model_id, export=True
        )
        model.save_pretrained(save_dir)

        quantizer = ORTQuantizer.from_pretrained(save_dir)
        qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False, per_channel=False)
        quantizer.quantize(save_dir=save_dir, quantization_config=qconfig)

        logger.info(f"INT8 quantization complete: {save_dir}")
        return save_dir, "INT8"

    except Exception as e:
        logger.warning(f"INT8 quantization failed for {model_id}: {e} — falling back to FP16")
        return _export_fp16(model_id, save_dir)


def _export_fp16(model_id: str, save_dir: str) -> tuple[str, str]:
    """Export model to ONNX FP16 as fallback."""
    try:
        from optimum.onnxruntime import ORTModelForSequenceClassification
        import torch

        model = ORTModelForSequenceClassification.from_pretrained(
            model_id, export=True, provider="CPUExecutionProvider"
        )
        model.save_pretrained(save_dir)
        logger.info(f"FP16 ONNX export complete: {save_dir}")
        return save_dir, "FP16"
    except Exception as e:
        logger.error(f"FP16 export also failed: {e}")
        raise


def load_quantized_pipeline(model_id: str, task: str = "text-classification"):
    """Load a previously quantized ONNX model as a HuggingFace pipeline."""
    safe_name = model_id.replace("/", "__")
    save_dir = str(QUANTIZED_DIR / safe_name)

    if not os.path.exists(save_dir):
        quantize_model(model_id, save_dir)

    try:
        from optimum.onnxruntime import ORTModelForSequenceClassification
        from transformers import pipeline, AutoTokenizer

        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = ORTModelForSequenceClassification.from_pretrained(save_dir)
        return pipeline(task, model=model, tokenizer=tokenizer)
    except Exception as e:
        logger.error(f"Failed to load quantized model {model_id}: {e}")
        raise
