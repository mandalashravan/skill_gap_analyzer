from django.test import TestCase
from rest_framework.test import APIClient
from .models import JobRole, JobRoleSkill
from skills.models import Skill
from backend.test_runner import run_test_cases

class JobsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.job = JobRole.objects.create(name='Backend Developer', description='Test description')
        self.skill = Skill.objects.create(name='Django', category='Backend')
        JobRoleSkill.objects.create(job_role=self.job, skill=self.skill, priority='High', weight=5)

    def test_jobs_api(self):
        schema = {
            "id": {"type": int},
            "name": {"type": str},
            "description": {"type": str}
        }
        cases = [
            {"name": "Valid GET Jobs", "expected_status": 200, "expected_schema": schema, "stress_test": True},
        ]
        run_test_cases(self, self.client, "Jobs", "/api/jobs/", "GET", cases)

        schema_skills = {
            "id": {"type": int},
            "job_role": {"type": int},
            "skill": {"type": int},
            "skill_name": {"type": str},
            "priority": {"type": str},
            "weight": {"type": int}
        }
        cases_skills = [
            {"name": "Valid GET Job Skills", "endpoint": f"/api/jobs/{self.job.id}/skills/", "expected_status": 200, "expected_schema": schema_skills, "stress_test": True},
            {"name": "Invalid Job ID", "endpoint": "/api/jobs/999/skills/", "expected_status": 404},
        ]
        run_test_cases(self, self.client, "Job Skills", "", "GET", cases_skills)
