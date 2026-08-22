from rest_framework import serializers
from .models import RecruiterProfile, JobPosting


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = ['id', 'user', 'company_name', 'contact_phone', 'status', 'created_at']
        read_only_fields = ['user', 'status']


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            'id', 'recruiter_profile', 'title', 'required_endorsements',
            'required_experience_years', 'required_equipment', 'region',
            'location', 'route_type', 'is_active', 'created_at',
        ]
        read_only_fields = ['recruiter_profile']