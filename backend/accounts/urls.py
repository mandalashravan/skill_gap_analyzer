from django.urls import path
from .views import (
    RegisterView, ProfileView, MyTokenObtainPairView, UserProfileView,
    UserProfileUploadView, ResumeUploadView, ProfilePictureUploadView,
    UserManagementView, UserProfileManagementView, ChangePasswordView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('upload/', UserProfileUploadView.as_view(), name='upload'),
    path('upload-resume/', ResumeUploadView.as_view(), name='upload-resume'),
    path('upload-profile-picture/', ProfilePictureUploadView.as_view(), name='upload-profile-picture'),
    path('users/', UserManagementView.as_view(), name='user-management'),
    path('user-profiles/<int:pk>/', UserProfileManagementView.as_view(), name='user-profile-management'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
