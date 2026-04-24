from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SkillProgress
from .serializers import SkillProgressSerializer

class RoadmapListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = SkillProgress.objects.filter(user=request.user)
        serializer = SkillProgressSerializer(progress, many=True)
        return Response(serializer.data)

class UpdateProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        skill_id = request.data.get('skill_id')
        if skill_id is None:
            return Response({"error": "Missing skill_id"}, status=400)
            
        status = request.data.get('status')
        try:
            progress = SkillProgress.objects.get(user=request.user, skill_id=skill_id)
            if status:
                progress.status = status
            if 'progress_percentage' in request.data:
                try:
                    perc = float(request.data['progress_percentage'])
                    if not (0 <= perc <= 100):
                        return Response({"error": "progress_percentage must be between 0 and 100"}, status=400)
                    progress.progress_percentage = perc
                except (ValueError, TypeError):
                    return Response({"error": "Invalid progress_percentage"}, status=400)
            progress.save()
            return Response({"message": "Progress updated successfully"})
        except SkillProgress.DoesNotExist:
            return Response({"error": "Progress not found"}, status=404)
        except (ValueError, TypeError):
            return Response({"error": "Invalid skill_id type"}, status=400)

class ProgressStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress_items = SkillProgress.objects.filter(user=request.user)
        total = progress_items.count()
        completed = progress_items.filter(status='Completed').count()
        
        overall = 0
        if total > 0:
            overall = sum([p.progress_percentage for p in progress_items]) / total

        return Response({
            "total_skills_to_learn": total,
            "completed_skills": completed,
            "overall_completion_percentage": round(overall, 2)
        })
