from django.db import models
from django.contrib.auth.models import User
from skills.models import Skill

class SkillProgress(models.Model):
    STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('Learning', 'Learning'),
        ('Completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_progress')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='progress')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Not Started')
    progress_percentage = models.IntegerField(default=0)
    week = models.IntegerField(default=1)
    estimated_hours = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.user.username} - {self.skill.name} ({self.progress_percentage}%)"
