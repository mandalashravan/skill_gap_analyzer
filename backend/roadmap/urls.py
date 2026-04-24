from django.urls import path
from .views import RoadmapListView, UpdateProgressView, ProgressStatsView

urlpatterns = [
    path('', RoadmapListView.as_view(), name='roadmap-list'),
    path('update-progress/', UpdateProgressView.as_view(), name='update-progress'),
    path('progress/', ProgressStatsView.as_view(), name='progress-stats'),
]
