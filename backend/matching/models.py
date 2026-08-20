from django.db import models
from drivers.models import DriverProfile
from recruiters.models import JobPosting


class Match(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        CONTACTED = 'contacted', 'Contacted'

    class InitiatedBy(models.TextChoices):
        DRIVER = 'driver', 'Driver'
        RECRUITER = 'recruiter', 'Recruiter'

    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='matches')
    driver_profile = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='matches')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED)
    initiated_by = models.CharField(max_length=20, choices=InitiatedBy.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job_posting', 'driver_profile')

    def __str__(self):
        return f"{self.driver_profile.full_name} → {self.job_posting.title} ({self.status})"