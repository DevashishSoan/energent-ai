import requests
import time
import json

BASE_URL = "http://127.0.0.1:8001"

def test_health():
    print("Testing /api/health...")
    try:
        r = requests.get(f"{BASE_URL}/api/health")
        r.raise_for_status()
        print("✓ Health check passed:", r.json())
    except Exception as e:
        print("✗ Health check failed:", e)

def test_models():
    print("\nTesting /api/models...")
    try:
        r = requests.get(f"{BASE_URL}/api/models")
        r.raise_for_status()
        models = r.json()
        print(f"✓ Found {len(models)} models.")
        return models
    except Exception as e:
        print("✗ Models check failed:", e)
        return []

def test_prediction(model_id):
    print(f"\nTesting /api/predict for {model_id}...")
    try:
        params = {
            "model_id": model_id,
            "compute_target": "cpu",
            "precision": "FP32"
        }
        r = requests.get(f"{BASE_URL}/api/predict", params=params)
        r.raise_for_status()
        data = r.json()
        print("✓ Prediction:", json.dumps(data, indent=2))
    except Exception as e:
        print("✗ Prediction failed:", e)

def test_run(model_id):
    print(f"\nTesting /api/run for {model_id}...")
    try:
        payload = {
            "model": model_id,
            "task": "NLP",
            "precision": "FP32",
            "compute_target": "cpu",
            "batch_size": 1,
            "num_samples": 5
        }
        r = requests.post(f"{BASE_URL}/api/run", json=payload)
        r.raise_for_status()
        run_id = r.json()["run_id"]
        print(f"✓ Run started. ID: {run_id}")
        
        # Poll for completion
        for _ in range(20):
            time.sleep(1)
            r = requests.get(f"{BASE_URL}/api/run/{run_id}")
            status = r.json()["status"]
            print(f"Run status: {status}")
            if status == "complete":
                print("✓ Run completed successfully!")
                print("Result:", json.dumps(r.json(), indent=2))
                return
            if status == "failed":
                print("✗ Run failed.")
                return
        print("✗ Run timed out.")
    except Exception as e:
        print("✗ Run execution failed:", e)

def main():
    test_health()
    models = test_models()
    
    # Use DistilBERT (smaller, faster)
    model_id = "distilbert-base-uncased"
    test_prediction(model_id)
    test_run(model_id)

if __name__ == "__main__":
    main()
