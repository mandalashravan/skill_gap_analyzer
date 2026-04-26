import pdfplumber
import docx
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import AnalysisReport
from jobs.models import JobRole, JobRoleSkill
from skills.models import Skill, UserSkill
from roadmap.models import SkillProgress

def extract_text_from_pdf(file):
    with pdfplumber.open(file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    return "\n".join([para.text for para in doc.paragraphs])

from .serializers import AnalysisReportSerializer

class UploadResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'resume' not in request.FILES:
            return Response({"error": "No resume file provided"}, status=400)
            
        resume_file = request.FILES['resume']
        filename = resume_file.name.lower()
        
        try:
            if filename.endswith('.pdf'):
                text = extract_text_from_pdf(resume_file)
            elif filename.endswith('.docx'):
                text = extract_text_from_docx(resume_file)
            else:
                return Response({"error": "Unsupported file format. Please upload PDF or DOCX."}, status=400)
        except Exception as e:
            return Response({"error": f"Failed to process file: {str(e)}"}, status=500)

        # Basic skill extraction logic: Match keywords against Skill database
        all_skills = Skill.objects.all()
        extracted_skills = []
        text_lower = text.lower()
        
        for skill in all_skills:
            if skill.name.lower() in text_lower:
                UserSkill.objects.get_or_create(user=request.user, skill=skill)
                extracted_skills.append(skill.name)
        
        # If no skills matched from DB, add a few defaults if text is found
        if not extracted_skills and len(text) > 50:
            defaults = ["Python", "JavaScript", "SQL", "React", "Docker"]
            for d in defaults:
                if d.lower() in text_lower:
                    skill, _ = Skill.objects.get_or_create(name=d, defaults={'category': 'General'})
                    UserSkill.objects.get_or_create(user=request.user, skill=skill)
                    extracted_skills.append(d)

        return Response({
            "message": "Resume processed successfully",
            "extracted_skills": list(set(extracted_skills)),
            "text_preview": text[:200] + "..." if text else "No text extracted"
        })


class ExtractedSkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = UserSkill.objects.filter(user=request.user).values_list('skill__name', flat=True)
        return Response({"skills": list(skills)})

class SkillGapView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_role_id = request.data.get('job_role_id')
        if job_role_id is None:
            return Response({"error": "Missing job_role_id"}, status=400)
            
        try:
            job_role = JobRole.objects.get(id=job_role_id)
        except JobRole.DoesNotExist:
            return Response({"error": "Job role not found"}, status=404)
        except (ValueError, TypeError):
            return Response({"error": "Invalid job_role_id type"}, status=400)

        required_skills = JobRoleSkill.objects.filter(job_role=job_role)
        user_skills = UserSkill.objects.filter(user=request.user).values_list('skill_id', flat=True)
        
        matched_skills = []
        missing_skills = []
        matched_weight = 0
        total_weight = 0

        for req in required_skills:
            total_weight += req.weight
            if req.skill_id in user_skills:
                matched_skills.append(req.skill.name)
                matched_weight += req.weight
            else:
                missing_skills.append({"skill": req.skill.name, "priority": req.priority})
                SkillProgress.objects.get_or_create(
                    user=request.user,
                    skill=req.skill,
                    defaults={'status': 'Not Started', 'progress_percentage': 0, 'week': 1, 'estimated_hours': 10}
                )

        readiness_score = (matched_weight / total_weight) * 100 if total_weight > 0 else 0

        # Generate Improvement Suggestions
        suggestions = {
            "ats_tips": [
                "Use standard job titles that match the role you're applying for.",
                "Incorporate keywords from the job description naturally into your bullet points.",
                "Avoid using complex graphics or tables that might confuse ATS parsers."
            ],
            "missing_keywords": [s['skill'] for s in missing_skills[:5]],
            "project_ideas": [
                f"Build a portfolio project showcasing {missing_skills[0]['skill']}" if missing_skills else "Work on a full-stack integration project.",
                "Contribute to an open-source tool related to your target role."
            ]
        }

        AnalysisReport.objects.create(
            user=request.user,
            job_role=job_role,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            readiness_score=readiness_score,
            improvement_suggestions=suggestions
        )

        return Response({
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "readiness_score": round(readiness_score, 2),
            "suggestions": suggestions
        })

class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = AnalysisReport.objects.filter(user=request.user).order_by('-created_at')
        serializer = AnalysisReportSerializer(reports, many=True)
        return Response(serializer.data)

class UserAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.GET.get('days', 30))
        
        # Get user's analysis reports
        reports = AnalysisReport.objects.filter(
            user=request.user,
            created_at__gte=timezone.now() - timedelta(days=days)
        ).order_by('-created_at')
        
        # Calculate analytics
        total_analyses = reports.count()
        
        # Get readiness scores trend
        readiness_scores = [report.readiness_score for report in reports]
        avg_readiness = sum(readiness_scores) / len(readiness_scores) if readiness_scores else 0
        
        # Get most common missing skills
        all_missing_skills = []
        for report in reports:
            all_missing_skills.extend([skill['skill'] for skill in report.missing_skills])
        
        from collections import Counter
        common_gaps = Counter(all_missing_skills).most_common(5)
        
        # Get job roles analyzed
        job_roles = list(reports.values_list('job_role__name', flat=True).distinct())
        
        return Response({
            "total_analyses": total_analyses,
            "average_readiness": round(avg_readiness, 2),
            "most_common_skill_gaps": [{"skill": skill, "count": count} for skill, count in common_gaps],
            "job_roles_analyzed": job_roles,
            "recent_reports": AnalysisReportSerializer(reports[:5], many=True).data,
            "period_days": days
        })
