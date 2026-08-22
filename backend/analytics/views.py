from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg, F
from users.models import User
from drivers.models import DriverProfile, StatusHistory
from matching.models import Match
from users.permissions import IsAdmin


class AnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_drivers = User.objects.filter(role='driver').count()
        total_recruiters = User.objects.filter(role='recruiter').count()
        total_matches = Match.objects.count()

        # Average time between profile creation and first moderation action
        turnaround_qs = StatusHistory.objects.values('driver_profile').annotate(
            first_review=F('changed_at')
        ).order_by('driver_profile', 'changed_at')

        pending_count = DriverProfile.objects.filter(status='pending').count()
        approved_count = DriverProfile.objects.filter(status='approved').count()
        rejected_count = DriverProfile.objects.filter(status='rejected').count()

        return Response({
            'total_driver_signups': total_drivers,
            'total_recruiter_signups': total_recruiters,
            'total_matches_made': total_matches,
            'driver_status_breakdown': {
                'pending': pending_count,
                'approved': approved_count,
                'rejected': rejected_count,
            },
        })