from rest_framework import serializers
from .models import SkillProgress

from skills.serializers import SkillSerializer

class SkillProgressSerializer(serializers.ModelSerializer):
    skill_details = SkillSerializer(source='skill', read_only=True)

    class Meta:
        model = SkillProgress
        fields = ('id', 'user', 'skill', 'skill_details', 'status', 'progress_percentage', 'week', 'estimated_hours')
