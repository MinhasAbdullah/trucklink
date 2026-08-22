from django.db import models
from django.conf import settings
from drivers.models import Region, EndorsementType, EquipmentType


class RecruiterProfile(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACTIVE = 'active', 'Active'
        SUSPENDED = 'suspended', 'Suspended'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=150)
    contact_phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.status})"


class JobPosting(models.Model):
    recruiter_profile = models.ForeignKey(RecruiterProfile, on_delete=models.CASCADE, related_name='job_postings')
    title = models.CharField(max_length=150)
    required_endorsements = models.ManyToManyField(EndorsementType, blank=True, related_name='job_postings')
    required_experience_years = models.PositiveIntegerField(default=0)
    required_equipment = models.ForeignKey(EquipmentType, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_postings')
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_postings')
    location = models.CharField(max_length=150, blank=True)
    route_type = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.recruiter_profile.company_name}"