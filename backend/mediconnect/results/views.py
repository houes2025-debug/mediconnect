from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse

from .models import MedicalResult
from .serializers import MedicalResultSerializer, MedicalResultCreateSerializer
from notifications.models import Notification

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os



class MedicalResultViewSet(viewsets.ModelViewSet):
    #permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalResult.objects.filter(patient=user)
        elif user.role == 'doctor':
            return MedicalResult.objects.filter(doctor=user)
        return MedicalResult.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MedicalResultCreateSerializer
        return MedicalResultSerializer
    
    def perform_create(self, serializer):
        
        result = serializer.save()
        
        # Créer une notification
        Notification.objects.create(
            user=result.patient,
            type='result',
            title='Nouveaux résultats disponibles',
            message=f'Vos {result.get_type_display()} sont prêts',
            link=f'/results/{result.id}'
        )
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        result = self.get_object()
        result.status = 'downloaded'
        result.save()
        
        return FileResponse(result.file.open('rb'), 
                          as_attachment=True, 
                          filename=result.file.name)
    
    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        result = self.get_object()
        if result.status == 'new':
            result.status = 'viewed'
            result.save()
        return Response({'status': 'marked as viewed'})