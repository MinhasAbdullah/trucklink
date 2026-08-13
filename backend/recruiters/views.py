from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RecruiterProfile, JobPosting
from .serializers import RecruiterProfileSerializer, JobPostingSerializer
from users.permissions import IsRecruiter, IsAdmin


class RecruiterProfileCreateView(generics.CreateAPIView):
    serializer_class = RecruiterProfileSerializer
    permission_classes = [IsRecruiter]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecruiterProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = RecruiterProfileSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        return RecruiterProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return self.get_queryset().get()


class JobPostingCreateView(generics.CreateAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [IsRecruiter]

    def perform_create(self, serializer):
        recruiter_profile = RecruiterProfile.objects.get(user=self.request.user)
        serializer.save(recruiter_profile=recruiter_profile)


class JobPostingListView(generics.ListAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        return JobPosting.objects.filter(recruiter_profile__user=self.request.user)


class RecruiterListView(generics.ListAPIView):
    """Admin: list all recruiter accounts"""
    serializer_class = RecruiterProfileSerializer
    permission_classes = [IsAdmin]
    queryset = RecruiterProfile.objects.all()


class RecruiterStatusUpdateView(APIView):
    """Admin: approve/suspend a recruiter account"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            recruiter = RecruiterProfile.objects.get(pk=pk)
        except RecruiterProfile.DoesNotExist:
            return Response({'error': 'Recruiter not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['active', 'suspended', 'pending']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        recruiter.status = new_status
        recruiter.save()
        return Response(RecruiterProfileSerializer(recruiter).data, status=status.HTTP_200_OK)