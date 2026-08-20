from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import DriverProfile, StatusHistory
from .serializers import DriverProfileSerializer, ModerationActionSerializer, StatusHistorySerializer
from rest_framework.views import APIView
from users.permissions import IsDriver, IsAdmin

class DriverProfileCreateView(generics.CreateAPIView):
    serializer_class = DriverProfileSerializer
    permission_classes = [IsDriver]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DriverProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = DriverProfileSerializer
    permission_classes = [IsDriver]

    def get_queryset(self):
        return DriverProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return self.get_queryset().get()


class ModerationQueueView(generics.ListAPIView):
    """Admin: list all pending driver profiles"""
    serializer_class = DriverProfileSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return DriverProfile.objects.filter(DriverProfile.Status.PENDING)


class ModerateDriverProfileView(APIView):
    """Admin: approve, reject, or request changes for a driver profile"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            profile = DriverProfile.objects.get(pk=pk)
        except DriverProfile.DoesNotExist:
            return Response({"detail": "Driver profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ModerationActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data['action']
        comment = serializer.validated_data.get('comment', '')

        old_status = profile.status


        if action == 'approve':
            new_status = DriverProfile.Status.APPROVED
        elif action == 'reject':
            new_status = DriverProfile.Status.REJECTED
        else:  # request_changes
            new_status = DriverProfile.Status.PENDING  # stays pending, driver edits and resubmits

        profile.status = new_status
        profile.status_reason = comment
        profile.save()

        StatusHistory.objects.create(
            driver_profile=profile,
            old_status=old_status,
            new_status=new_status,
            changed_by=request.user,
            comment=comment,
        )

        return Response(DriverProfileSerializer(profile).data, status=status.HTTP_200_OK)