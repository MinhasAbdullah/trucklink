from django.contrib import admin
from .models import RecruiterProfile, JobPosting


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'status', 'created_at')


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'recruiter_profile', 'region', 'required_experience_years', 'is_active', 'created_at')
    list_filter = ('is_active', 'region')