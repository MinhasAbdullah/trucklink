from rest_framework import generics, permissions
from .serializers import DriverSignupSerializer, RecruiterSignupSerializer


class DriverSignupView(generics.CreateAPIView):
    serializer_class = DriverSignupSerializer
    permission_classes = [permissions.AllowAny]

class RecruiterSignupView(generics.CreateAPIView):
    serializer_class = RecruiterSignupSerializer
    permission_classes = [permissions.AllowAny]