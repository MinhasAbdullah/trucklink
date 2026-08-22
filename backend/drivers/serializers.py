from rest_framework import serializers
from .models import DriverProfile, DriverDocument, StatusHistory, EndorsementType, EquipmentType, Region


class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = [
            'id', 'user', 'full_name', 'phone', 'cdl_class',
            'endorsements', 'years_experience', 'equipment_types',
            'preferred_region', 'availability', 'status', 'status_reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'status', 'status_reason']  # driver can't self-approve


class ModerationActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject', 'request_changes'])
    comment = serializers.CharField(required=False, allow_blank=True)


class StatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusHistory
        fields = ['id', 'old_status', 'new_status', 'changed_by', 'comment', 'changed_at']