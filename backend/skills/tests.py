from django.test import TestCase
from rest_framework.test import APIClient
from .models import Skill
from backend.test_runner import run_test_cases

class SkillsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Skill.objects.create(name='Python', category='Backend')

    def test_skills_api(self):
        schema = {
            "id": {"type": int},
            "name": {"type": str},
            "category": {"type": str}
        }
        cases = [
            {"name": "Valid GET Skills", "input": {}, "expected_status": 200, "expected_schema": schema, "stress_test": True},
        ]
        run_test_cases(self, self.client, "Skills", "/api/skills/", "GET", cases)
