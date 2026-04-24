from rest_framework import serializers
from .models import JobRole, JobRoleSkill

class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRole
        fields = '__all__'

class JobRoleSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = JobRoleSkill
        fields = ('id', 'job_role', 'skill', 'skill_name', 'priority', 'weight')
