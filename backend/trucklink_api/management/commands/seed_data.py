from django.core.management.base import BaseCommand
from datetime import date, timedelta
from trucklink_api.models import Load, Truck

class Command(BaseCommand):
    help = 'Seeds initial sample data for Loads and Trucks for logistics testing.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding sample TruckLink data...')

        # Clear existing data if needed
        Load.objects.all().delete()
        Truck.objects.all().delete()

        today = date.today()

        # 1. Sample Loads
        load1 = Load.objects.create(
            title="40k lbs Temperature Controlled Produce",
            origin_city="Chicago, IL",
            origin_lat=41.8781,
            origin_lng=-87.6298,
            destination_city="Atlanta, GA",
            destination_lat=33.7490,
            destination_lng=-84.3880,
            equipment_type="Reefer",
            weight_lbs=40000,
            max_budget=2200.00,
            pickup_date=today,
            status="OPEN",
            image_url="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
            document_url="https://res.cloudinary.com/demo/raw/upload/v1/sample_bol_1.pdf"
        )

        load2 = Load.objects.create(
            title="Heavy Structural Steel Beams",
            origin_city="Gary, IN",
            origin_lat=41.5934,
            origin_lng=-87.3464,
            destination_city="Dallas, TX",
            destination_lat=32.7767,
            destination_lng=-96.7970,
            equipment_type="Flatbed",
            weight_lbs=44000,
            max_budget=3400.00,
            pickup_date=today + timedelta(days=1),
            status="OPEN",
            image_url="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            document_url="https://res.cloudinary.com/demo/raw/upload/v1/sample_steel_manifest.pdf"
        )

        load3 = Load.objects.create(
            title="Palletized Retail Electronics",
            origin_city="Milwaukee, WI",
            origin_lat=43.0389,
            origin_lng=-87.9065,
            destination_city="Indianapolis, IN",
            destination_lat=39.7684,
            destination_lng=-86.1581,
            equipment_type="Dry Van",
            weight_lbs=26000,
            max_budget=1450.00,
            pickup_date=today,
            status="OPEN",
            image_url="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
            document_url="https://res.cloudinary.com/demo/raw/upload/v1/sample_electronics_packing.pdf"
        )

        # 2. Sample Trucks
        truck1 = Truck.objects.create(
            driver_name="Michael Reynolds",
            truck_number="TRK-9082",
            equipment_type="Reefer",
            max_capacity_lbs=43000,
            current_city="Chicago, IL",
            current_lat=41.8818,
            current_lng=-87.6231,
            target_city="Atlanta, GA",
            target_lat=33.7490,
            target_lng=-84.3880,
            min_rate_per_mile=2.60,
            available_date=today,
            status="AVAILABLE",
            truck_image_url="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
            license_doc_url="https://res.cloudinary.com/demo/raw/upload/v1/driver_cdl_reynolds.pdf"
        )

        truck2 = Truck.objects.create(
            driver_name="David Vance",
            truck_number="TRK-4410",
            equipment_type="Flatbed",
            max_capacity_lbs=48000,
            current_city="Chicago, IL",
            current_lat=41.8500,
            current_lng=-87.6500,
            target_city="Dallas, TX",
            target_lat=32.7767,
            target_lng=-96.7970,
            min_rate_per_mile=3.10,
            available_date=today + timedelta(days=1),
            status="AVAILABLE",
            truck_image_url="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
            license_doc_url="https://res.cloudinary.com/demo/raw/upload/v1/driver_cdl_vance.pdf"
        )

        truck3 = Truck.objects.create(
            driver_name="Sarah Connor",
            truck_number="TRK-7721",
            equipment_type="Dry Van",
            max_capacity_lbs=34000,
            current_city="Milwaukee, WI",
            current_lat=43.0389,
            current_lng=-87.9065,
            target_city="Indianapolis, IN",
            target_lat=39.7684,
            target_lng=-86.1581,
            min_rate_per_mile=2.40,
            available_date=today,
            status="AVAILABLE",
            truck_image_url="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            license_doc_url="https://res.cloudinary.com/demo/raw/upload/v1/driver_cdl_connor.pdf"
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded 3 Loads and 3 Trucks!'))
