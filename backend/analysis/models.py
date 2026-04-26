from django.db import models
from django.contrib.auth.models import User
from jobs.models import JobRole
from django.utils import timezone

class AnalysisReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analysis_reports')
    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE, related_name='analysis_reports')
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    readiness_score = models.FloatField(default=0.0)
    improvement_suggestions = models.JSONField(default=dict)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.job_role.name} ({self.readiness_score}%)"
