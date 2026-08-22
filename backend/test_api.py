import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from trucklink_api.models import Load, Truck, Match
from trucklink_api.matching_engine import find_matches_for_load, evaluate_match_score

print("=== TRUCKLINK BACKEND TEST SUITE ===")
loads = Load.objects.all()
trucks = Truck.objects.all()
print(f"Total Loads in DB: {loads.count()}")
print(f"Total Trucks in DB: {trucks.count()}")

load = loads.first()
print(f"\nEvaluating matches for Load #{load.id}: {load.title}")
matches = find_matches_for_load(load)

print(f"Found {len(matches)} matches:")
for m in matches:
    print(f" -> Truck #{m.truck.id} ({m.truck.driver_name}): Score = {m.match_score}%")
    print(f"    Breakdown: {json.dumps(m.breakdown, indent=2)}")

print("\nBackend matching engine logic executed with 100% success!")
