from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from backend.test_runner import run_test_cases

class AccountsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')

    def test_register_api(self):
        schema = {
            "message": {"type": str},
            "user_id": {"type": int}
        }
        cases = [
            {"name": "Valid Registration", "input": {"username": "newuser", "password": "newpassword", "email": "newuser@example.com"}, "expected_status": 201, "expected_schema": schema},
            {"name": "Boundary: Huge Username", "input": {"username": "a" * 1000, "password": "pwd", "email": "huge@example.com"}, "expected_status": 400},
            {"name": "Missing Password", "input": {"username": "newuser2", "email": "newuser2@example.com"}, "expected_status": 400},
            {"name": "Duplicate Username", "input": {"username": "testuser", "password": "somepassword"}, "expected_status": 400},
            {"name": "Empty Input", "input": {}, "expected_status": 400},
            {"name": "Null Values", "input": {"username": None, "password": "pwd"}, "expected_status": 400},
        ]
        run_test_cases(self, self.client, "Register", "/api/accounts/register/", "POST", cases)

    def test_login_api(self):
        schema = {
            "refresh": {"type": str},
            "access": {"type": str}
        }
        cases = [
            {"name": "Valid Login", "input": {"username": "testuser", "password": "testpassword"}, "expected_status": 200, "expected_schema": schema, "stress_test": True},
            {"name": "Invalid Password", "input": {"username": "testuser", "password": "wrongpassword"}, "expected_status": 401},
            {"name": "Missing Username", "input": {"password": "testpassword"}, "expected_status": 400},
            {"name": "Empty Input", "input": {}, "expected_status": 400},
            {"name": "Empty String Values", "input": {"username": "", "password": ""}, "expected_status": 400},
            {"name": "Wrong Data Type", "input": {"username": 123, "password": True}, "expected_status": 400},
        ]
        run_test_cases(self, self.client, "Login", "/api/accounts/login/", "POST", cases)

    def test_profile_api(self):
        self.client.force_authenticate(user=self.user)
        schema = {
            "id": {"type": int},
            "username": {"type": str},
            "email": {"type": str}
        }
        cases = [
            {"name": "Valid Profile GET", "input": {}, "expected_status": 200, "expected_schema": schema, "stress_test": True},
        ]
        run_test_cases(self, self.client, "Profile", "/api/accounts/profile/", "GET", cases)
        
        self.client.logout()
        cases_unauth = [
            {"name": "Missing Token", "input": {}, "expected_status": 401},
        ]
        run_test_cases(self, self.client, "Profile", "/api/accounts/profile/", "GET", cases_unauth)
        
        # Invalid Token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')
        cases_invalid_token = [
            {"name": "Invalid Token", "input": {}, "expected_status": 401},
        ]
        run_test_cases(self, self.client, "Profile", "/api/accounts/profile/", "GET", cases_invalid_token)
