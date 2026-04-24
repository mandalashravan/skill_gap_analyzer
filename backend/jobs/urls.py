from django.urls import path
from .views import JobRoleListView, JobRoleSkillListView

urlpatterns = [
    path('', JobRoleListView.as_view(), name='job-list'),
    path('<int:id>/skills/', JobRoleSkillListView.as_view(), name='job-skills'),
]
