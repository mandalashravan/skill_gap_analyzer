from rest_framework import generics
from .models import JobRole, JobRoleSkill
from .serializers import JobRoleSerializer, JobRoleSkillSerializer

class JobRoleListView(generics.ListAPIView):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer

from django.http import Http404

class JobRoleSkillListView(generics.ListAPIView):
    serializer_class = JobRoleSkillSerializer

    def get_queryset(self):
        job_role_id = self.kwargs['id']
        if not JobRole.objects.filter(id=job_role_id).exists():
            raise Http404("Job role not found")
        return JobRoleSkill.objects.filter(job_role_id=job_role_id)
