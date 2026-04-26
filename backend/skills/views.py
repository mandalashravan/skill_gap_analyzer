from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import Skill, Quiz, LearningResource, QuizResult, UserAnswer, Question
from .serializers import (
    SkillSerializer, QuizSerializer, QuizCreateUpdateSerializer, LearningResourceSerializer, 
    QuizResultSerializer, QuizAttemptSerializer, QuestionSerializer
)

class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class SkillCreateView(generics.CreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]

class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]

class QuizListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class QuizCreateView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizCreateUpdateSerializer
    permission_classes = [IsAdminUser]

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return QuizCreateUpdateSerializer
        return QuizSerializer

class LearningResourceListView(generics.ListAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer

class LearningResourceCreateView(generics.CreateAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [IsAdminUser]

class LearningResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LearningResource.objects.all()
    serializer_class = LearningResourceSerializer
    permission_classes = [IsAdminUser]

class SkillResourcesView(APIView):
    def get(self, request, skill_id):
        skill = get_object_or_404(Skill, id=skill_id)
        resources = skill.resources.all()
        serializer = LearningResourceSerializer(resources, many=True)
        return Response(serializer.data)

class QuizTakingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        questions = quiz.questions.all()
        
        # Check if user has already taken this quiz
        existing_result = QuizResult.objects.filter(user=request.user, quiz=quiz).first()
        if existing_result:
            return Response({
                "quiz": QuizSerializer(quiz).data,
                "questions": QuestionSerializer(questions, many=True).data,
                "attempted": True,
                "result": QuizResultSerializer(existing_result).data
            })
        
        return Response({
            "quiz": QuizSerializer(quiz).data,
            "questions": QuestionSerializer(questions, many=True).data,
            "attempted": False
        })

    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        serializer = QuizAttemptSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        # Check if already attempted
        existing_result = QuizResult.objects.filter(user=request.user, quiz=quiz).first()
        if existing_result:
            return Response({"error": "Quiz already attempted"}, status=400)
        
        answers_data = serializer.validated_data['answers']
        questions = quiz.questions.all()
        
        # Calculate score
        correct_count = 0
        total_questions = questions.count()
        
        # Create quiz result
        quiz_result = QuizResult.objects.create(
            user=request.user,
            quiz=quiz,
            score=0,
            total_questions=total_questions,
            percentage=0.0
        )
        
        # Process answers
        for answer_data in answers_data:
            question_id = answer_data.get('question_id')
            selected_option = answer_data.get('selected_option')
            
            try:
                question = questions.get(id=question_id)
                is_correct = question.correct_option == selected_option
                
                if is_correct:
                    correct_count += 1
                
                UserAnswer.objects.create(
                    quiz_result=quiz_result,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
            except Question.DoesNotExist:
                continue
        
        # Update quiz result with final score
        percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0
        quiz_result.score = correct_count
        quiz_result.percentage = percentage
        quiz_result.save()
        
        return Response({
            "message": "Quiz submitted successfully",
            "result": QuizResultSerializer(quiz_result).data
        })

class QuizResultsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizResultSerializer
    
    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user).order_by('-completed_at')

class QuizResultDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizResultSerializer
    
    def get_queryset(self):
        return QuizResult.objects.filter(user=self.request.user)
