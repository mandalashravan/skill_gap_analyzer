from django.urls import path
from .views import (
    SkillListView, SkillCreateView, SkillDetailView,
    QuizListView, QuizCreateView, QuizDetailView, QuizTakingView, QuizResultsView, QuizResultDetailView,
    LearningResourceListView, LearningResourceCreateView, LearningResourceDetailView,
    SkillResourcesView
)

urlpatterns = [
    path('', SkillListView.as_view(), name='skill-list'),
    path('create/', SkillCreateView.as_view(), name='skill-create'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),
    path('<int:skill_id>/resources/', SkillResourcesView.as_view(), name='skill-resources'),
    
    path('quizzes/', QuizListView.as_view(), name='quiz-list'),
    path('quizzes/create/', QuizCreateView.as_view(), name='quiz-create'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:quiz_id>/take/', QuizTakingView.as_view(), name='quiz-take'),
    path('quizzes/results/', QuizResultsView.as_view(), name='quiz-results'),
    path('quizzes/results/<int:pk>/', QuizResultDetailView.as_view(), name='quiz-result-detail'),
    
    path('resources/', LearningResourceListView.as_view(), name='resource-list'),
    path('resources/create/', LearningResourceCreateView.as_view(), name='resource-create'),
    path('resources/<int:pk>/', LearningResourceDetailView.as_view(), name='resource-detail'),
]
