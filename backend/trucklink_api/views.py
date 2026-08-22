from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Load, Truck, Match
from .serializers import (
    LoadSerializer, TruckSerializer, MatchSerializer,
    MatchRequestSerializer, MatchAcceptSerializer
)
from .matching_engine import find_matches_for_load, find_matches_for_truck
from .cloudinary_service import upload_file_to_cloudinary, generate_cloudinary_signature
from .consumers import broadcast_realtime_event


class LoadViewSet(viewsets.ModelViewSet):
    queryset = Load.objects.all().order_by('-created_at')
    serializer_class = LoadSerializer

    def perform_create(self, serializer):
        load_instance = serializer.save()
        # Broadcast realtime event via Django Channels
        broadcast_realtime_event('NEW_LOAD_POSTED', LoadSerializer(load_instance).data)

    @action(detail=True, methods=['get'])
    def matches(self, request, pk=None):
        load = self.get_object()
        min_score = float(request.query_params.get('min_score', 40.0))
        match_objects = find_matches_for_load(load, min_score=min_score)
        serializer = MatchSerializer(match_objects, many=True)
        return Response({
            'load_id': load.id,
            'count': len(match_objects),
            'matches': serializer.data
        })


class TruckViewSet(viewsets.ModelViewSet):
    queryset = Truck.objects.all().order_by('-created_at')
    serializer_class = TruckSerializer

    def perform_create(self, serializer):
        truck_instance = serializer.save()
        # Broadcast realtime event via Django Channels
        broadcast_realtime_event('NEW_TRUCK_REGISTERED', TruckSerializer(truck_instance).data)

    @action(detail=True, methods=['get'])
    def matches(self, request, pk=None):
        truck = self.get_object()
        min_score = float(request.query_params.get('min_score', 40.0))
        match_objects = find_matches_for_truck(truck, min_score=min_score)
        serializer = MatchSerializer(match_objects, many=True)
        return Response({
            'truck_id': truck.id,
            'count': len(match_objects),
            'matches': serializer.data
        })


class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


class MatchingAPIView(APIView):
    def post(self, request):
        """
        POST /api/matching/find-matches/
        Payload: { "load_id": 1 } or { "truck_id": 2 }
        """
        serializer = MatchRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        load_id = serializer.validated_data.get('load_id')
        truck_id = serializer.validated_data.get('truck_id')
        min_score = serializer.validated_data.get('min_score', 40.0)

        match_objects = []
        target_entity = None

        if load_id:
            try:
                load = Load.objects.get(id=load_id)
                target_entity = {'type': 'load', 'id': load.id, 'title': load.title}
                match_objects = find_matches_for_load(load, min_score=min_score)
            except Load.DoesNotExist:
                return Response({'error': f'Load ID {load_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
        elif truck_id:
            try:
                truck = Truck.objects.get(id=truck_id)
                target_entity = {'type': 'truck', 'id': truck.id, 'number': truck.truck_number}
                match_objects = find_matches_for_truck(truck, min_score=min_score)
            except Truck.DoesNotExist:
                return Response({'error': f'Truck ID {truck_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Either load_id or truck_id must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        result_serializer = MatchSerializer(match_objects, many=True)
        
        # Realtime notification
        broadcast_realtime_event('MATCHES_CALCULATED', {
            'target': target_entity,
            'match_count': len(match_objects),
            'top_score': match_objects[0].match_score if match_objects else 0.0
        })

        return Response({
            'success': True,
            'target': target_entity,
            'count': len(match_objects),
            'matches': result_serializer.data
        })


class AcceptMatchAPIView(APIView):
    def post(self, request):
        """
        POST /api/matching/accept/
        Payload: { "match_id": 5 }
        """
        serializer = MatchAcceptSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        match_id = serializer.validated_data.get('match_id')

        try:
            match_obj = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({'error': f'Match ID {match_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update statuses
        match_obj.status = 'ACCEPTED'
        match_obj.save()

        load = match_obj.load
        load.status = 'MATCHED'
        load.save()

        truck = match_obj.truck
        truck.status = 'BOOKED'
        truck.save()

        payload = {
            'match_id': match_obj.id,
            'match_score': match_obj.match_score,
            'load': LoadSerializer(load).data,
            'truck': TruckSerializer(truck).data
        }

        # Broadcast realtime match acceptance to all connected clients!
        broadcast_realtime_event('MATCH_ACCEPTED', payload)

        return Response({
            'success': True,
            'message': f'Match #{match_id} accepted successfully! Load #{load.id} is MATCHED and Truck #{truck.id} is BOOKED.',
            'data': payload
        })


class CloudinaryUploadView(APIView):
    def post(self, request):
        """
        POST /api/upload/cloudinary/
        Accepts multipart file payload under field name 'file' or 'image' or 'doc'.
        """
        file_obj = request.FILES.get('file') or request.FILES.get('image') or request.FILES.get('doc')
        if not file_obj:
            return Response({'error': 'No file provided in form-data payload (field name "file")'}, status=status.HTTP_400_BAD_REQUEST)

        folder = request.data.get('folder', 'trucklink_docs')
        result = upload_file_to_cloudinary(file_obj, folder=folder)

        # Realtime upload event notification
        broadcast_realtime_event('FILE_UPLOADED_CLOUDINARY', {
            'file_name': getattr(file_obj, 'name', 'file'),
            'url': result.get('url'),
            'public_id': result.get('public_id')
        })

        return Response(result, status=status.HTTP_201_CREATED if result.get('success') else status.HTTP_400_BAD_REQUEST)


class CloudinarySignatureView(APIView):
    def post(self, request):
        """
        POST /api/upload/signature/
        Generates direct signed signature for client-side uploads.
        """
        params = request.data.get('params', {})
        res = generate_cloudinary_signature(params)
        return Response(res)


class DashboardStatsView(APIView):
    def get(self, request):
        total_loads = Load.objects.count()
        open_loads = Load.objects.filter(status='OPEN').count()
        total_trucks = Truck.objects.count()
        available_trucks = Truck.objects.filter(status='AVAILABLE').count()
        accepted_matches = Match.objects.filter(status='ACCEPTED').count()

        return Response({
            'open_loads': open_loads,
            'total_loads': total_loads,
            'available_trucks': available_trucks,
            'total_trucks': total_trucks,
            'accepted_matches': accepted_matches,
            'system_status': 'Operational',
            'websocket_status': 'Active'
        })
