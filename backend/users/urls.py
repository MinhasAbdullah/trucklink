from django.urls import path
from .views import DriverSignupView, RecruiterSignupView

urlpatterns = [
    path('signup/driver/', DriverSignupView.as_view(), name='driver-signup'),
    path('signup/recruiter/', RecruiterSignupView.as_view(), name='recruiter-signup'),
]