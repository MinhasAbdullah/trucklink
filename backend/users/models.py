from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        DRIVER = 'driver', 'Driver'
        RECRUITER = 'recruiter', 'Recruiter'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DRIVER)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"