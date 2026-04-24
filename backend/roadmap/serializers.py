from rest_framework import serializers
from .models import SkillProgress

class SkillProgressSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = SkillProgress
        fields = ('id', 'user', 'skill', 'skill_name', 'status', 'progress_percentage', 'week', 'estimated_hours')
