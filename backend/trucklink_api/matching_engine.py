import math
from datetime import date
from .models import Load, Truck, Match

# Haversine distance formula calculation in Miles
def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    # Default fallback coordinates for common US logistics hubs if 0.0
    if lat1 == 0.0 and lon1 == 0.0:
        lat1, lon1 = 41.8781, -87.6298  # Chicago default
    if lat2 == 0.0 and lon2 == 0.0:
        lat2, lon2 = 33.7490, -84.3880  # Atlanta default

    R = 3958.8  # Earth radius in miles
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def evaluate_match_score(load: Load, truck: Truck):
    """
    Computes a weighted match score (0-100%) between a Load and a Truck.
    Returns:
        tuple: (overall_score, breakdown_dict)
    """

    # 1. Equipment Score (Weight: 25%)
    equipment_score = 0.0
    eq_load = load.equipment_type.strip()
    eq_truck = truck.equipment_type.strip()

    if eq_load == eq_truck:
        equipment_score = 100.0
    elif (eq_load in ['Flatbed', 'Stepdeck']) and (eq_truck in ['Flatbed', 'Stepdeck']):
        equipment_score = 80.0
    elif eq_truck == 'Reefer' and eq_load == 'Dry Van':
        equipment_score = 75.0  # Reefer can carry temperature-controlled or standard dry cargo
    else:
        equipment_score = 0.0

    # Disqualify if equipment is strictly incompatible
    if equipment_score == 0.0:
        return 0.0, {
            'equipment': {'score': 0, 'weight': '25%', 'reason': f'Incompatible equipment ({eq_load} vs {eq_truck})'},
            'disqualified': True
        }

    # 2. Weight & Capacity Score (Weight: 25%)
    if truck.max_capacity_lbs < load.weight_lbs:
        return 0.0, {
            'weight_capacity': {'score': 0, 'weight': '25%', 'reason': f'Truck payload ({truck.max_capacity_lbs} lbs) under load requirement ({load.weight_lbs} lbs)'},
            'disqualified': True
        }
    
    # Capacity efficiency calculation
    capacity_ratio = load.weight_lbs / float(truck.max_capacity_lbs)
    if capacity_ratio >= 0.7:
        weight_score = 100.0
    elif capacity_ratio >= 0.5:
        weight_score = 85.0
    else:
        weight_score = 70.0  # Slightly oversized truck for small load

    # 3. Geographic Proximity Score (Weight: 30%)
    distance_miles = calculate_haversine_distance(
        truck.current_lat, truck.current_lng,
        load.origin_lat, load.origin_lng
    )

    if distance_miles <= 30:
        distance_score = 100.0
    elif distance_miles <= 100:
        distance_score = 85.0
    elif distance_miles <= 250:
        distance_score = 65.0
    elif distance_miles <= 500:
        distance_score = 40.0
    else:
        distance_score = 15.0

    # 4. Date Alignment Score (Weight: 10%)
    try:
        date_diff = abs((load.pickup_date - truck.available_date).days)
        if date_diff == 0:
            date_score = 100.0
        elif date_diff == 1:
            date_score = 85.0
        elif date_diff == 2:
            date_score = 65.0
        else:
            date_score = 30.0
    except Exception:
        date_score = 50.0

    # 5. Financial Rate Alignment Score (Weight: 10%)
    # Distance from origin to destination for load
    load_trip_distance = calculate_haversine_distance(
        load.origin_lat, load.origin_lng,
        load.destination_lat, load.destination_lng
    )
    if load_trip_distance < 10:
        load_trip_distance = 350.0  # standard fallback trip length

    min_required_payout = float(truck.min_rate_per_mile) * load_trip_distance
    actual_budget = float(load.max_budget)

    if actual_budget >= min_required_payout:
        rate_score = 100.0
    elif actual_budget >= (min_required_payout * 0.85):
        rate_score = 80.0
    elif actual_budget >= (min_required_payout * 0.70):
        rate_score = 50.0
    else:
        rate_score = 20.0

    # Calculate overall weighted score
    overall_score = (
        (equipment_score * 0.25) +
        (weight_score * 0.25) +
        (distance_score * 0.30) +
        (date_score * 0.10) +
        (rate_score * 0.10)
    )

    breakdown = {
        'equipment': {
            'score': round(equipment_score, 1),
            'weight': '25%',
            'type_load': eq_load,
            'type_truck': eq_truck
        },
        'weight_capacity': {
            'score': round(weight_score, 1),
            'weight': '25%',
            'load_weight': load.weight_lbs,
            'truck_capacity': truck.max_capacity_lbs,
            'ratio': f"{round(capacity_ratio * 100, 1)}%"
        },
        'proximity': {
            'score': round(distance_score, 1),
            'weight': '30%',
            'deadhead_miles': round(distance_miles, 1),
            'truck_location': truck.current_city,
            'load_origin': load.origin_city
        },
        'date_alignment': {
            'score': round(date_score, 1),
            'weight': '10%',
            'pickup_date': str(load.pickup_date),
            'truck_available': str(truck.available_date)
        },
        'rate_fit': {
            'score': round(rate_score, 1),
            'weight': '10%',
            'budget': float(load.max_budget),
            'est_trip_miles': round(load_trip_distance, 1),
            'min_rate_pm': float(truck.min_rate_per_mile)
        },
        'disqualified': False
    }

    return round(overall_score, 1), breakdown


def find_matches_for_load(load: Load, min_score=40.0):
    """
    Finds and calculates match scores for a given Load against all available Trucks.
    """
    available_trucks = Truck.objects.filter(status='AVAILABLE')
    matches_results = []

    for truck in available_trucks:
        score, breakdown = evaluate_match_score(load, truck)
        if score >= min_score and not breakdown.get('disqualified', False):
            # Create or update Match record
            match_obj, created = Match.objects.update_or_create(
                load=load,
                truck=truck,
                defaults={
                    'match_score': score,
                    'breakdown': breakdown,
                    'status': 'PROPOSED'
                }
            )
            matches_results.append(match_obj)

    matches_results.sort(key=lambda m: m.match_score, reverse=True)
    return matches_results


def find_matches_for_truck(truck: Truck, min_score=40.0):
    """
    Finds and calculates match scores for a given Truck against all open Loads.
    """
    open_loads = Load.objects.filter(status='OPEN')
    matches_results = []

    for load in open_loads:
        score, breakdown = evaluate_match_score(load, truck)
        if score >= min_score and not breakdown.get('disqualified', False):
            match_obj, created = Match.objects.update_or_create(
                load=load,
                truck=truck,
                defaults={
                    'match_score': score,
                    'breakdown': breakdown,
                    'status': 'PROPOSED'
                }
            )
            matches_results.append(match_obj)

    matches_results.sort(key=lambda m: m.match_score, reverse=True)
    return matches_results
