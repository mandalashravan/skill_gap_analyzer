from django.urls import path
from .views import UploadResumeView, ExtractedSkillsView, SkillGapView, HistoryView, UserAnalyticsView

urlpatterns = [
    path('upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('extracted-skills/', ExtractedSkillsView.as_view(), name='extracted-skills'),
    path('skill-gap/', SkillGapView.as_view(), name='skill-gap'),
    path('history/', HistoryView.as_view(), name='history'),
    path('analytics/', UserAnalyticsView.as_view(), name='user-analytics'),
]
