import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_prediction():
    print("Testing /api/predict for BERT Large...")
    try:
        # BERT Large ID from DB
        params = {
            "model_id": "bert-large-uncased",
            "compute_target": "gpu",
            "precision": "FP32"
        }
        r = requests.get(f"{BASE_URL}/api/predict", params=params)
        r.raise_for_status()
        data = r.json()
        print("✓ Prediction Success!")
        print(json.dumps(data, indent=2))
        return True
    except Exception as e:
        print("✗ Prediction failed:", e)
        return False

if __name__ == "__main__":
    test_prediction()
