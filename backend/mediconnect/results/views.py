from decimal import Decimal, InvalidOperation

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse

from .models import MedicalResult
from .serializers import MedicalResultSerializer, MedicalResultCreateSerializer
from notifications.models import Notification

import os


class MedicalResultViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

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

    def perform_update(self, serializer):
        # Un patient ne peut jamais modifier son propre solde, quelle que soit
        # la requête envoyée — seul le endpoint update_payment (médecin/admin)
        # peut le faire.
        if self.request.user.role == 'patient':
            serializer.validated_data.pop('reste_a_payer', None)
        serializer.save()

    @staticmethod
    def _is_payment_pending(result):
        """
        Règle de paiement, identique à celle du frontend :
        "En instance" est le cas par défaut, y compris quand reste_a_payer
        n'est pas renseigné. Seule une valeur explicitement égale à 0
        débloque le téléchargement.
        Valeur spéciale : -1 signifie « prêt à télécharger » (pas un vrai montant).
        """
        if result.reste_a_payer is not None and result.reste_a_payer == -1:
            return False
        return result.reste_a_payer is None or result.reste_a_payer > 0

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        result = self.get_object()

        if self._is_payment_pending(result):
            return Response(
                {
                    'error': 'Le solde restant doit être réglé avant de télécharger ce résultat.',
                    'reste_a_payer': str(result.reste_a_payer) if result.reste_a_payer is not None else None,
                },
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        result.status = 'downloaded'
        result.save()

        return FileResponse(
            result.file.open('rb'),
            as_attachment=True,
            filename=os.path.basename(result.file.name)
        )

    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        result = self.get_object()
        if result.status == 'new':
            result.status = 'viewed'
            result.save()
        return Response({'status': 'marked as viewed'})

    @action(detail=True, methods=['patch'], url_path='update-payment')
    def update_payment(self, request, pk=None):
        """
        Endpoint dédié pour encaisser un paiement — réservé médecin/admin.
        PATCH /api/results/{id}/update-payment/  { "reste_a_payer": 0 }
        """
        result = self.get_object()

        if request.user.role not in ('doctor', 'admin') and not request.user.is_staff:
            return Response(
                {'error': "Vous n'êtes pas autorisé à modifier le paiement."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            montant = Decimal(str(request.data.get('reste_a_payer')))
        except (InvalidOperation, TypeError):
            return Response({'error': 'Montant invalide'}, status=status.HTTP_400_BAD_REQUEST)

        if montant < 0 and montant != -1:
            return Response(
                {'error': 'Le montant ne peut pas être négatif (sauf -1, valeur spéciale : prêt à télécharger).'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result.reste_a_payer = montant
        result.save()
        return Response(MedicalResultSerializer(result).data)