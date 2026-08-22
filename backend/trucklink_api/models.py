from django.db import models

class Load(models.Model):
    EQUIPMENT_CHOICES = [
        ('Dry Van', 'Dry Van'),
        ('Reefer', 'Reefer'),
        ('Flatbed', 'Flatbed'),
        ('Stepdeck', 'Stepdeck'),
        ('Box Truck', 'Box Truck'),
    ]

    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('MATCHED', 'Matched'),
        ('IN_TRANSIT', 'In Transit'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    origin_city = models.CharField(max_length=100)
    origin_lat = models.FloatField(default=0.0)
    origin_lng = models.FloatField(default=0.0)
    destination_city = models.CharField(max_length=100)
    destination_lat = models.FloatField(default=0.0)
    destination_lng = models.FloatField(default=0.0)
    equipment_type = models.CharField(max_length=50, choices=EQUIPMENT_CHOICES, default='Dry Van')
    weight_lbs = models.IntegerField(help_text="Weight in LBS")
    max_budget = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total budget USD")
    pickup_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    
    # Cloudinary URLs
    image_url = models.URLField(max_length=500, blank=True, null=True)
    document_url = models.URLField(max_length=500, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Load #{self.id}: {self.title} ({self.origin_city} -> {self.destination_city})"


class Truck(models.Model):
    EQUIPMENT_CHOICES = [
        ('Dry Van', 'Dry Van'),
        ('Reefer', 'Reefer'),
        ('Flatbed', 'Flatbed'),
        ('Stepdeck', 'Stepdeck'),
        ('Box Truck', 'Box Truck'),
    ]

    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BOOKED', 'Booked'),
        ('MAINTENANCE', 'Maintenance'),
    ]

    driver_name = models.CharField(max_length=100)
    truck_number = models.CharField(max_length=50)
    equipment_type = models.CharField(max_length=50, choices=EQUIPMENT_CHOICES, default='Dry Van')
    max_capacity_lbs = models.IntegerField(help_text="Max payload capacity in LBS")
    current_city = models.CharField(max_length=100)
    current_lat = models.FloatField(default=0.0)
    current_lng = models.FloatField(default=0.0)
    target_city = models.CharField(max_length=100, blank=True, null=True)
    target_lat = models.FloatField(default=0.0)
    target_lng = models.FloatField(default=0.0)
    min_rate_per_mile = models.DecimalField(max_digits=8, decimal_places=2, default=2.50)
    available_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')

    # Cloudinary URLs
    truck_image_url = models.URLField(max_length=500, blank=True, null=True)
    license_doc_url = models.URLField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Truck #{self.id}: {self.truck_number} ({self.driver_name} - {self.equipment_type})"


class Match(models.Model):
    STATUS_CHOICES = [
        ('PROPOSED', 'Proposed'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    load = models.ForeignKey(Load, on_delete=models.CASCADE, related_name='matches')
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE, related_name='matches')
    match_score = models.FloatField(help_text="Match score percentage (0-100)")
    breakdown = models.JSONField(default=dict, help_text="Detailed score metrics")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROPOSED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-match_score', '-created_at']

    def __str__(self):
        return f"Match Load #{self.load.id} <-> Truck #{self.truck.id} ({self.match_score:.1f}%)"
