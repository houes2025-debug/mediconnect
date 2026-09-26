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
    #permission_classes = [IsAuthenticated]  # ← décommenté, urgent
    
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

        if result.reste_a_payer and result.reste_a_payer > 0:
            return Response(
                {'error': 'Le solde restant doit être réglé avant de télécharger ce résultat.',
                 'reste_a_payer': str(result.reste_a_payer)},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        result.status = 'downloaded'
        result.save()
        
        return FileResponse(
            result.file.open('rb'),
            as_attachment=True,
            filename=os.path.basename(result.file.name)  # bug corrigé, voir note plus bas
        )
    
    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        result = self.get_object()
        if result.status == 'new':
            result.status = 'viewed'
            result.save()
        return Response({'status': 'marked as viewed'})