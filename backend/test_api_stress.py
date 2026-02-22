import requests
import concurrent.futures
import time

endpoints = [
    "http://localhost:5001/api/models",
    "http://localhost:5001/api/hardware",
    "http://localhost:5001/api/predict?model_id=bert-large-uncased&compute_target=gpu&precision=FP32",
    "http://localhost:5001/api/runs/history",
    "http://localhost:5001/api/health",
    "http://localhost:5001/api/run/run_latest_if_any" # Placeholder
]

def check_endpoint(url):
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            return f"FAIL: {url} returned {r.status_code}: {r.text}"
        return f"OK: {url}"
    except Exception as e:
        return f"ERROR: {url} failed: {e}"

print("Starting API Stress Test...")
# Get recent run id to test
try:
    history = requests.get("http://localhost:5001/api/runs/history").json()
    if history:
        endpoints[-1] = f"http://localhost:5001/api/run/{history[0]['run_id']}"
        print(f"Testing with run_id: {history[0]['run_id']}")
except:
    pass

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    for i in range(5): # 5 rounds of 5 endpoints
        print(f"Round {i+1}...")
        results = list(executor.map(check_endpoint, endpoints * 2)) # 10 requests per round
        for res in results:
            if "FAIL" in res or "ERROR" in res:
                print(res)
        time.sleep(0.5)

print("Test complete.")
