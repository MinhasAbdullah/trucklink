from django.urls import path
from .views import (
    RecruiterProfileCreateView, RecruiterProfileDetailView,
    JobPostingCreateView, JobPostingListView,
    RecruiterListView, RecruiterStatusUpdateView,
)

urlpatterns = [
    path('profile/', RecruiterProfileCreateView.as_view(), name='recruiter-profile-create'),
    path('profile/me/', RecruiterProfileDetailView.as_view(), name='recruiter-profile-detail'),
    path('jobs/', JobPostingCreateView.as_view(), name='job-create'),
    path('jobs/mine/', JobPostingListView.as_view(), name='job-list-mine'),
    path('admin/list/', RecruiterListView.as_view(), name='recruiter-list'),
    path('admin/<int:pk>/status/', RecruiterStatusUpdateView.as_view(), name='recruiter-status-update'),
]