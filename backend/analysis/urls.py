from django.urls import path
from .views import UploadResumeView, ExtractedSkillsView, SkillGapView

urlpatterns = [
    path('upload-resume/', UploadResumeView.as_view(), name='upload-resume'),
    path('extracted-skills/', ExtractedSkillsView.as_view(), name='extracted-skills'),
    path('skill-gap/', SkillGapView.as_view(), name='skill-gap'),
]
