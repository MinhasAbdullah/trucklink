from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoadViewSet, TruckViewSet, MatchViewSet,
    MatchingAPIView, AcceptMatchAPIView,
    CloudinaryUploadView, CloudinarySignatureView,
    DashboardStatsView
)

router = DefaultRouter()
router.register(r'loads', LoadViewSet, basename='load')
router.register(r'trucks', TruckViewSet, basename='truck')
router.register(r'matches', MatchViewSet, basename='match')

urlpatterns = [
    path('', include(router.urls)),
    path('matching/find-matches/', MatchingAPIView.as_view(), name='find-matches'),
    path('matching/accept/', AcceptMatchAPIView.as_view(), name='accept-match'),
    path('upload/cloudinary/', CloudinaryUploadView.as_view(), name='cloudinary-upload'),
    path('upload/signature/', CloudinarySignatureView.as_view(), name='cloudinary-signature'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
