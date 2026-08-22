from rest_framework import serializers
from .models import Load, Truck, Match

class LoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Load
        fields = '__all__'


class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Truck
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    load_details = LoadSerializer(source='load', read_only=True)
    truck_details = TruckSerializer(source='truck', read_only=True)

    class Meta:
        model = Match
        fields = '__all__'


class MatchRequestSerializer(serializers.Serializer):
    load_id = serializers.IntegerField(required=False)
    truck_id = serializers.IntegerField(required=False)
    min_score = serializers.FloatField(default=40.0, required=False)


class MatchAcceptSerializer(serializers.Serializer):
    match_id = serializers.IntegerField(required=True)
