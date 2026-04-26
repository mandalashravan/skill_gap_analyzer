from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import JobRole, JobRoleSkill
from .serializers import JobRoleSerializer, JobRoleSkillSerializer
from analysis.models import AnalysisReport
from skills.models import Skill
from collections import Counter

class JobRoleListView(generics.ListAPIView):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer

class JobRoleCreateView(generics.CreateAPIView):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer
    permission_classes = [IsAdminUser]

class JobRoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer
    permission_classes = [IsAdminUser]

class JobRoleSkillListView(generics.ListAPIView):
    serializer_class = JobRoleSkillSerializer

    def get_queryset(self):
        job_role_id = self.kwargs['id']
        if not JobRole.objects.filter(id=job_role_id).exists():
            raise Http404("Job role not found")
        return JobRoleSkill.objects.filter(job_role_id=job_role_id)

class JobRoleSkillCreateView(generics.CreateAPIView):
    queryset = JobRoleSkill.objects.all()
    serializer_class = JobRoleSkillSerializer
    permission_classes = [IsAdminUser]

class JobRoleSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobRoleSkill.objects.all()
    serializer_class = JobRoleSkillSerializer
    permission_classes = [IsAdminUser]

class SystemAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_reports = AnalysisReport.objects.count()
        role_stats = AnalysisReport.objects.values('job_role__name').annotate(count=Count('id')).order_by('-count')
        
        # Aggregate all missing skills from all reports
        all_missing = []
        for report in AnalysisReport.objects.all():
            all_missing.extend([s['skill'] for s in report.missing_skills])
        
        common_gaps = Counter(all_missing).most_common(5)
        
        return Response({
            "total_users_analyzed": total_reports,
            "most_requested_roles": list(role_stats[:5]),
            "most_common_skill_gaps": [{"skill": s, "count": c} for s, c in common_gaps]
        })

class JobRoleSkillsBulkView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, job_role_id):
        job_role = get_object_or_404(JobRole, id=job_role_id)
        skills_data = request.data.get('skills', [])
        
        # Clear existing skills for this job role
        JobRoleSkill.objects.filter(job_role=job_role).delete()
        
        # Create new skill associations
        created_skills = []
        for skill_data in skills_data:
            skill_id = skill_data.get('skill_id')
            priority = skill_data.get('priority', 'Medium')
            weight = skill_data.get('weight', 1)
            
            skill = get_object_or_404(Skill, id=skill_id)
            job_role_skill = JobRoleSkill.objects.create(
                job_role=job_role,
                skill=skill,
                priority=priority,
                weight=weight
            )
            created_skills.append(job_role_skill)
        
        serializer = JobRoleSkillSerializer(created_skills, many=True)
        return Response(serializer.data)
