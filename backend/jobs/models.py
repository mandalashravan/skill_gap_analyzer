from django.db import models
from skills.models import Skill

class JobRole(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class JobRoleSkill(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    job_role = models.ForeignKey(JobRole, on_delete=models.CASCADE, related_name='required_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='job_roles')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    weight = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.job_role.name} - {self.skill.name} ({self.priority})"
