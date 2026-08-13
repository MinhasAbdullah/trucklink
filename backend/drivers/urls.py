from django.urls import path
from .views import (
    DriverProfileCreateView, DriverProfileDetailView,
    ModerationQueueView, ModerateDriverProfileView,
)

urlpatterns = [
    path('profile/', DriverProfileCreateView.as_view(), name='driver-profile-create'),
    path('profile/me/', DriverProfileDetailView.as_view(), name='driver-profile-detail'),
    path('moderation/queue/', ModerationQueueView.as_view(), name='moderation-queue'),
    path('moderation/<int:pk>/', ModerateDriverProfileView.as_view(), name='moderate-profile'),
]