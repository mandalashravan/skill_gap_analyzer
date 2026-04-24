from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from skills.models import Skill, UserSkill
from jobs.models import JobRole, JobRoleSkill
from backend.test_runner import run_test_cases

class AnalysisAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        
        self.job = JobRole.objects.create(name='Backend Developer')
        self.skill1 = Skill.objects.create(name='Python', category='Backend')
        self.skill2 = Skill.objects.create(name='Docker', category='DevOps')
        
        JobRoleSkill.objects.create(job_role=self.job, skill=self.skill1, priority='High', weight=10)
        JobRoleSkill.objects.create(job_role=self.job, skill=self.skill2, priority='High', weight=10)
        
        UserSkill.objects.create(user=self.user, skill=self.skill1)

    def test_upload_resume_api(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        resume = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
        
        schema = {
            "message": {"type": str},
            "extracted_skills": {"type": list, "non_empty": True}
        }
        cases = [
            {"name": "Valid Upload", "input": {"resume": resume}, "format": "multipart", "expected_status": 200, "expected_schema": schema},
            {"name": "Missing File", "input": {}, "format": "multipart", "expected_status": 400},
        ]
        run_test_cases(self, self.client, "Upload Resume", "/api/analysis/upload-resume/", "POST", cases)

    def test_extracted_skills_api(self):
        cases = [
            {"name": "Valid GET Extracted Skills", "input": {}, "expected_status": 200, "expected_schema": {"skills": {"type": list}}},
        ]
        run_test_cases(self, self.client, "Extracted Skills", "/api/analysis/extracted-skills/", "GET", cases)

    def test_skill_gap_api(self):
        schema = {
            "matched_skills": {"type": list},
            "missing_skills": {"type": list, "non_empty": True}, 
            "readiness_score": {"type": (int, float), "min": 0.0, "max": 100.0}
        }
        cases = [
            {"name": "Valid Job ID", "input": {"job_role_id": self.job.id}, "expected_status": 200, "expected_schema": schema, "stress_test": True},
            {"name": "Invalid Job ID", "input": {"job_role_id": 999}, "expected_status": 404},
            {"name": "Missing Job ID", "input": {}, "expected_status": 400},
            {"name": "Wrong Data Type", "input": {"job_role_id": "invalid"}, "expected_status": 400},
            {"name": "Null Data Type", "input": {"job_role_id": None}, "expected_status": 400},
            {"name": "Negative ID", "input": {"job_role_id": -5}, "expected_status": 404},
        ]
        run_test_cases(self, self.client, "Skill Gap", "/api/analysis/skill-gap/", "POST", cases)
