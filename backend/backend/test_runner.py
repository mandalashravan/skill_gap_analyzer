import json
import os
import time
from django.test.runner import DiscoverRunner

class TestResultTracker:
    def __init__(self):
        self.results = []

    def add(self, result):
        self.results.append(result)

    def save(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(base_dir, 'test_results.json')
        md_path = os.path.join(base_dir, 'API_TESTS.md')

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=4)

        total = len(self.results)
        passed = sum(1 for r in self.results if r['status'] == 'Passed')
        failed = total - passed
        
        valid_times = [r['avg_response_time'] for r in self.results if r.get('avg_response_time') is not None]
        avg_time = sum(valid_times) / len(valid_times) if valid_times else 0

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write("# Data-Driven API Test Results\n\n")
            f.write("## Summary\n")
            f.write(f"- **Total Tests**: {total}\n")
            f.write(f"- **Passed**: {passed}\n")
            f.write(f"- **Failed**: {failed}\n")
            f.write(f"- **Average Response Time**: {avg_time:.2f}ms\n\n")
            
            f.write("## Test Details\n")
            f.write("| API | Test Case | Expected Status | Actual Status | Valid Status | Avg Time (ms) | Status | Error |\n")
            f.write("|---|---|---|---|---|---|---|---|\n")
            for res in self.results:
                time_ms = f"{res.get('avg_response_time', 0):.2f}"
                err = res.get('error_message', '').replace('\n', ' ')
                
                status_icon = "Passed" if res['status'] == "Passed" else "🔴 Failed"
                
                f.write(f"| {res['api']} | {res['test_case']} | {res['expected_status']} | {res['actual_status']} | {res['data_valid']} | {time_ms} | {status_icon} | {err} |\n")

tracker = TestResultTracker()

def validate_schema(data, schema):
    validation_errors = []
    missing_keys = []
    
    if not isinstance(data, dict):
        return ["Data is not a dictionary"], [], []

    for key, rules in schema.items():
        if key not in data:
            missing_keys.append(key)
            validation_errors.append(f"Missing required key: {key}")
            continue
            
        val = data[key]
        expected_type = rules.get('type')
        if expected_type and not isinstance(val, expected_type):
            validation_errors.append(f"Key '{key}' expected {expected_type}, got {type(val)}")
            
        if 'min' in rules and isinstance(val, (int, float)):
            if val < rules['min']:
                validation_errors.append(f"Key '{key}' value {val} is below minimum {rules['min']}")
                
        if 'max' in rules and isinstance(val, (int, float)):
            if val > rules['max']:
                validation_errors.append(f"Key '{key}' value {val} is above maximum {rules['max']}")

        if 'non_empty' in rules and rules['non_empty'] and hasattr(val, '__len__'):
            if len(val) == 0:
                validation_errors.append(f"Key '{key}' cannot be empty")

    extra_keys = [k for k in data.keys() if k not in schema]
    if extra_keys:
        validation_errors.append(f"Extra keys found: {', '.join(extra_keys)}")

    return validation_errors, missing_keys, extra_keys


def run_test_cases(test_obj, client, api_name, endpoint, method, cases):
    for case in cases:
        error_message = ""
        status = "Passed"
        validation_errors = []
        missing_keys = []
        extra_keys = []
        data_valid = True
        
        is_stress = case.get('stress_test', False)
        iterations = 10 if is_stress else 1
        
        times = []
        last_response = None
        
        for i in range(iterations):
            start_time = time.time()
            if method == 'POST':
                if 'format' in case:
                    response = client.post(endpoint, case.get('input', {}), format=case['format'])
                else:
                    response = client.post(endpoint, case.get('input', {}), format='json')
            else:
                ep = case.get('endpoint', endpoint)
                response = getattr(client, method.lower())(ep)
            
            req_time = (time.time() - start_time) * 1000
            times.append(req_time)
            last_response = response
            
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        actual_status = last_response.status_code
        
        try:
            test_obj.assertEqual(actual_status, case['expected_status'], f"Expected {case['expected_status']} but got {actual_status}")
            
            # Stress testing validation
            if is_stress:
                if avg_time > 1000 and max_time > 1500:
                    raise AssertionError(f"Stress test failed: avg {avg_time:.2f}ms > 1000ms and max {max_time:.2f}ms > 1500ms")
            
            # Schema Validation
            if actual_status in [200, 201] and 'expected_schema' in case:
                data = last_response.data
                if isinstance(data, list):
                    if len(data) > 0:
                        data = data[0]
                    else:
                        data = {}
                
                v_errs, m_keys, e_keys = validate_schema(data, case['expected_schema'])
                validation_errors.extend(v_errs)
                missing_keys.extend(m_keys)
                extra_keys.extend(e_keys)
                
                if validation_errors:
                    data_valid = False
                    raise AssertionError("Schema validation failed: " + " | ".join(validation_errors))
                    
            # Custom validation
            if 'custom_validation' in case and actual_status in [200, 201]:
                case['custom_validation'](test_obj, last_response.data)
                
        except AssertionError as e:
            status = "Failed"
            error_message = str(e)
            data_valid = False
            
        input_repr = "File Data" if 'format' in case else case.get('input', {})

        tracker.add({
            "api": api_name,
            "test_case": case['name'],
            "input": input_repr,
            "expected_status": case['expected_status'],
            "actual_status": actual_status,
            "missing_keys": missing_keys,
            "extra_keys": extra_keys,
            "validation_errors": validation_errors,
            "data_valid": data_valid,
            "avg_response_time": avg_time,
            "min_response_time": min_time,
            "max_response_time": max_time,
            "status": status,
            "error_message": error_message
        })
        
        if status == "Failed":
            raise AssertionError(error_message)

class DataDrivenTestRunner(DiscoverRunner):
    def teardown_test_environment(self, **kwargs):
        super().teardown_test_environment(**kwargs)
        tracker.save()
        print("Successfully saved test_results.json and API_TESTS.md to backend/")
