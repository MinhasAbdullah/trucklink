from django.db import models
from django.conf import settings


class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class EndorsementType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class EquipmentType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class DriverProfile(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='driver_profile')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    cdl_class = models.CharField(max_length=10)  # e.g., "A", "B", "C"
    endorsements = models.ManyToManyField(EndorsementType, blank=True, related_name='drivers')
    years_experience = models.PositiveIntegerField(default=0)
    equipment_types = models.ManyToManyField(EquipmentType, blank=True, related_name='drivers')
    preferred_region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, related_name='drivers')
    availability = models.CharField(max_length=100, blank=True)  # e.g., "Immediate", "2 weeks notice"
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    status_reason = models.TextField(blank=True)  # admin's comment on reject/changes-requested
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.status}"


class DriverDocument(models.Model):
    class DocType(models.TextChoices):
        LICENSE = 'license', 'License'
        MEDICAL_CARD = 'medical_card', 'Medical Card'

    driver_profile = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    file = models.FileField(upload_to='driver_documents/')  # Cloudinary storage handles actual upload
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.driver_profile.full_name} - {self.doc_type}"


class StatusHistory(models.Model):
    driver_profile = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='status_history')
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='moderation_actions')
    comment = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.driver_profile.full_name}: {self.old_status} → {self.new_status}"