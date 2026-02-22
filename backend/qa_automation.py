import requests
import time
import json
import sys

# Configuration
BASE_URL = "http://127.0.0.1:5001"
WAIT_TIMEOUT_S = 30

class QARunner:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0

    def log(self, message, status="INFO"):
        print(f"[{status}] {message}")
        if status in ["PASS", "FAIL"]:
            self.results.append({"test": message, "status": status})
            if status == "PASS":
                self.passed += 1
            else:
                self.failed += 1

    def assert_true(self, condition, message):
        if condition:
            self.log(message, "PASS")
        else:
            self.log(message, "FAIL")
            print("  -> Assertion Failed!")

    def run_tests(self):
        print("Starting Automated QA for Energent AI Monitor...\n")
        
        # 1. Health Check
        try:
            r = requests.get(f"{BASE_URL}/api/health")
            self.assert_true(r.status_code == 200, "Backend Health Check (200 OK)")
            data = r.json()
            self.assert_true(data["status"] == "ok", "Health status is 'ok'")
            self.assert_true("carbon_intensity_g_kwh" in data, "Carbon intensity data available")
        except Exception as e:
            self.log(f"Health check exception: {e}", "FAIL")

        # 2. Hardware Info
        try:
            r = requests.get(f"{BASE_URL}/api/hardware")
            self.assert_true(r.status_code == 200, "Hardware Info Fetch")
            hw = r.json()
            print(f"  -> CPU: {hw.get('cpu_model')}")
            print(f"  -> NPU Available: {hw.get('npu_available')}")
        except Exception as e:
            self.log(f"Hardware check exception: {e}", "FAIL")

        # 3. Model Database (Critical for "Models not showing" issue)
        models = []
        try:
            r = requests.get(f"{BASE_URL}/api/models")
            self.assert_true(r.status_code == 200, "Model Database Fetch")
            models = r.json()
            self.assert_true(len(models) > 0, f"Models loaded: {len(models)}")
            if len(models) > 0:
                print(f"  -> First model: {models[0]['model_id']}")
        except Exception as e:
            self.log(f"Model fetch exception: {e}", "FAIL")

        if not models:
            self.log("Skipping further tests due to missing models.", "FAIL")
            return

        # 4. Prediction Engine
        test_model = models[1] # Use DistilBERT
        model_id = test_model["model_id"]
        try:
            params = {"model_id": model_id, "compute_target": "cpu", "precision": "FP32"}
            r = requests.get(f"{BASE_URL}/api/predict", params=params)
            self.assert_true(r.status_code == 200, f"Prediction for {model_id}")
            pred = r.json()
            self.assert_true(pred["predicted_watts"] > 0, "Predicted watts > 0")
            self.assert_true("predicted_grade" in pred, "Prediction includes efficiency grade")
            print(f"  -> Predicted: {pred['predicted_watts']}W, Grade: {pred['predicted_grade']}")
        except Exception as e:
            self.log(f"- Prediction exception: {e}", "FAIL")

        # 5. Workload Execution Simulation
        run_id = None
        try:
            payload = {
                "model": model_id,
                "task": "NLP",
                "precision": "FP32",
                "compute_target": "cpu",
                "batch_size": 1,
                "num_samples": 10
            }
            r = requests.post(f"{BASE_URL}/api/run", json=payload)
            self.assert_true(r.status_code == 200, "Workload Execution Start")
            run_id = r.json()["run_id"]
            print(f"  -> Run ID: {run_id}")
        except Exception as e:
            self.log(f"Workload start exception: {e}", "FAIL")

        # 6. Polling for Completion
        if run_id:
            completed = False
            for _ in range(WAIT_TIMEOUT_S):
                time.sleep(1)
                try:
                    r = requests.get(f"{BASE_URL}/api/run/{run_id}")
                    if r.status_code != 200: continue
                    status = r.json()["status"]
                    if status == "complete":
                        completed = True
                        data = r.json()
                        self.assert_true(True, f"Run {run_id} completed successfully")
                        self.assert_true(data["duration_s"] > 0, "Duration recorded")
                        self.assert_true(data["co2_g"] >= 0, "CO2 calculation valid")
                        print(f"  -> Result: {data['avg_watts']}W avg, {data['co2_g']}g CO2")
                        break
                    if status == "failed":
                        self.log(f"Run {run_id} failed", "FAIL")
                        break
                except:
                    pass
            
            if not completed:
                self.log(f"Run {run_id} timed out after {WAIT_TIMEOUT_S}s", "FAIL")

        # 7. Optimization Suggestions
        if run_id and completed:
            try:
                r = requests.get(f"{BASE_URL}/api/run/{run_id}/optimize")
                # It's okay if 400 or empty, but should be callable
                if r.status_code == 200:
                    suggestions = r.json()
                    self.log(f"Optimization endpoint accessible (Suggestions: {len(suggestions)})", "PASS")
                else:
                    self.log(f"Optimization endpoint returned {r.status_code}", "INFO")
            except Exception as e:
                self.log(f"Optimization fetch exception: {e}", "FAIL")

        # Summary
        print("\n--- QA SUMMARY ---")
        print(f"Total Tests: {self.passed + self.failed}")
        print(f"PASSED: {self.passed}")
        print(f"FAILED: {self.failed}")
        
        if self.failed > 0:
            sys.exit(1)

if __name__ == "__main__":
    runner = QARunner()
    runner.run_tests()
