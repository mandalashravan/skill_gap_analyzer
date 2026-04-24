from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from skills.models import Skill
from .models import SkillProgress
from backend.test_runner import run_test_cases

class RoadmapAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.other_user = User.objects.create_user(username='other', password='password')
        self.client.force_authenticate(user=self.user)
        
        self.skill = Skill.objects.create(name='Docker', category='DevOps')
        self.other_skill = Skill.objects.create(name='AWS', category='DevOps')
        self.progress = SkillProgress.objects.create(
            user=self.user,
            skill=self.skill,
            status='Not Started',
            week=1,
            estimated_hours=10
        )
        
        self.other_progress = SkillProgress.objects.create(
            user=self.other_user,
            skill=self.other_skill,
            status='Learning',
            week=2,
            estimated_hours=20
        )

    def test_roadmap_api(self):
        schema = {
            "id": {"type": int},
            "user": {"type": int},
            "skill": {"type": int},
            "skill_name": {"type": str},
            "status": {"type": str},
            "progress_percentage": {"type": (int, float), "min": 0, "max": 100},
            "week": {"type": int},
            "estimated_hours": {"type": int}
        }
        cases = [
            {"name": "Valid GET Roadmap", "input": {}, "expected_status": 200, "expected_schema": schema, "stress_test": True},
        ]
        run_test_cases(self, self.client, "Roadmap List", "/api/roadmap/", "GET", cases)

    def test_update_progress_api(self):
        schema = {
            "message": {"type": str}
        }
        cases = [
            {"name": "Valid Update Status", "input": {"skill_id": self.skill.id, "status": "Learning"}, "expected_status": 200, "expected_schema": schema},
            {"name": "Valid Update Percentage", "input": {"skill_id": self.skill.id, "progress_percentage": 50}, "expected_status": 200, "expected_schema": schema},
            {"name": "Cross-User Access", "input": {"skill_id": self.other_progress.skill_id, "progress_percentage": 100}, "expected_status": 404},
            {"name": "Boundary: Percentage > 100", "input": {"skill_id": self.skill.id, "progress_percentage": 150}, "expected_status": 400},
            {"name": "Boundary: Percentage < 0", "input": {"skill_id": self.skill.id, "progress_percentage": -10}, "expected_status": 400},
            {"name": "Wrong Data Type: Percentage string", "input": {"skill_id": self.skill.id, "progress_percentage": "fifty"}, "expected_status": 400},
            {"name": "Null Skill ID", "input": {"skill_id": None, "status": "Learning"}, "expected_status": 400},
            {"name": "Wrong Type Skill ID", "input": {"skill_id": "invalid"}, "expected_status": 400},
            {"name": "Missing Skill ID", "input": {"status": "Learning"}, "expected_status": 400},
        ]
        run_test_cases(self, self.client, "Update Progress", "/api/roadmap/update-progress/", "POST", cases)

    def test_progress_stats_api(self):
        schema = {
            "total_skills_to_learn": {"type": int},
            "completed_skills": {"type": int},
            "overall_completion_percentage": {"type": (int, float), "min": 0, "max": 100}
        }
        cases = [
            {"name": "Valid GET Progress Stats", "input": {}, "expected_status": 200, "expected_schema": schema},
        ]
        run_test_cases(self, self.client, "Progress Stats", "/api/roadmap/progress/", "GET", cases)
