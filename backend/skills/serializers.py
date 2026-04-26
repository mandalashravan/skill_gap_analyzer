from rest_framework import serializers
from .models import Skill, LearningResource, Quiz, Question, QuizResult, UserAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class NestedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['quiz']  # Exclude quiz field for nested creation

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'skill', 'skill_name', 'title', 'description', 'questions']

class QuizCreateUpdateSerializer(serializers.ModelSerializer):
    questions = NestedQuestionSerializer(many=True)
    
    class Meta:
        model = Quiz
        fields = ['skill', 'title', 'description', 'questions']
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        
        return quiz
    
    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        
        # Update quiz fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Delete existing questions
        instance.questions.all().delete()
        
        # Create new questions
        for question_data in questions_data:
            Question.objects.create(quiz=instance, **question_data)
        
        return instance

class LearningResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningResource
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    resources = LearningResourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Skill
        fields = ('id', 'name', 'category', 'resources')

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = '__all__'

class QuizResultSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    skill_name = serializers.CharField(source='quiz.skill.name', read_only=True)
    
    class Meta:
        model = QuizResult
        fields = '__all__'

class QuizAttemptSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField()
    )
