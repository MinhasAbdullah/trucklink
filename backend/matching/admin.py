from django.contrib import admin
from .models import Match


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('driver_profile', 'job_posting', 'status', 'created_at')
    list_filter = ('status',)