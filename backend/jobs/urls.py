from django.urls import path
from .views import (
    JobRoleListView, JobRoleCreateView, JobRoleDetailView,
    JobRoleSkillListView, JobRoleSkillCreateView, JobRoleSkillDetailView,
    SystemAnalyticsView, JobRoleSkillsBulkView
)

urlpatterns = [
    path('', JobRoleListView.as_view(), name='job-list'),
    path('create/', JobRoleCreateView.as_view(), name='job-create'),
    path('<int:pk>/', JobRoleDetailView.as_view(), name='job-detail'),
    path('<int:id>/skills/', JobRoleSkillListView.as_view(), name='job-skills'),
    path('<int:id>/skills/create/', JobRoleSkillCreateView.as_view(), name='job-skill-create'),
    path('<int:id>/skills/bulk/', JobRoleSkillsBulkView.as_view(), name='job-skills-bulk'),
    path('skills/<int:pk>/', JobRoleSkillDetailView.as_view(), name='job-skill-detail'),
    path('analytics/', SystemAnalyticsView.as_view(), name='system-analytics'),
]
