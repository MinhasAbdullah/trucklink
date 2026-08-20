from django.contrib import admin
from .models import DriverProfile, DriverDocument, StatusHistory, EndorsementType, EquipmentType, Region


@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'status', 'cdl_class', 'years_experience', 'created_at')
    list_filter = ('status', 'cdl_class')
    search_fields = ('full_name', 'user__username')


@admin.register(DriverDocument)
class DriverDocumentAdmin(admin.ModelAdmin):
    list_display = ('driver_profile', 'doc_type', 'uploaded_at')


@admin.register(StatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('driver_profile', 'old_status', 'new_status', 'changed_by', 'changed_at')


admin.site.register(EndorsementType)
admin.site.register(EquipmentType)
admin.site.register(Region)