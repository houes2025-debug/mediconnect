from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Message, Group

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def groups(request):
    if request.method == 'GET':
        # Récupérer les groupes de l'utilisateur
        if request.user.role == 'admin':
            user_groups = Group.objects.all()
        elif request.user.role == 'doctor':
            user_groups = Group.objects.filter(doctors=request.user)
        else:  # patient
            user_groups = Group.objects.filter(patients=request.user)
        
        groups_data = [{
            'id': group.id,
            'name': group.name,
            'description': group.description,
            'doctors': [{'id': d.id, 'first_name': d.first_name, 'last_name': d.last_name} for d in group.doctors.all()],
            'patients': [{'id': p.id, 'first_name': p.first_name, 'last_name': p.last_name} for p in group.patients.all()],
            'admins': [{'id': a.id, 'first_name': a.first_name, 'last_name': a.last_name} for a in group.admins.all()],
            'created_at': group.created_at.isoformat(),
            'message_count': group.message_count
        } for group in user_groups]
        
        return Response({'results': groups_data}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Créer un groupe (admin seulement)
        if request.user.role != 'admin':
            return Response({'error': 'Seuls les admins peuvent créer des groupes'}, status=status.HTTP_403_FORBIDDEN)
        
        name = request.data.get('name')
        description = request.data.get('description', '')
        doctor_ids = request.data.get('doctor_ids', [])
        patient_ids = request.data.get('patient_ids', [])
        admin_ids = request.data.get('admin_ids', [])
        
        group = Group.objects.create(
            name=name,
            description=description,
            created_by=request.user
        )
        
        # Ajouter les membres
        if doctor_ids:
            group.doctors.set(doctor_ids)
        if patient_ids:
            group.patients.set(patient_ids)
        
        # Ajouter les admins (incluant le créateur)
        admin_ids_set = set(admin_ids) if admin_ids else set()
        admin_ids_set.add(request.user.id)
        group.admins.set(list(admin_ids_set))
        
        return Response({
            'id': group.id,
            'name': group.name,
            'message': 'Groupe créé avec succès'
        }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def messages(request):
    group_id = request.query_params.get('group_id')
    
    if request.method == 'GET':
        if group_id:
            # Messages d'un groupe spécifique
            user_messages = Message.objects.filter(group_id=group_id)
        else:
            # Tous les messages de l'utilisateur
            user_messages = Message.objects.filter(
                Q(sender=request.user) | 
                Q(receiver=request.user) |
                Q(group__doctors=request.user) |
                Q(group__patients=request.user) |
                Q(group__admins=request.user)
            ).distinct()
        
        user_messages = user_messages.select_related('sender', 'receiver', 'group')
        
        messages_data = [{
            'id': msg.id,
            'sender': 'patient' if msg.sender.role == 'patient' else 'doctor',
            'sender_id': msg.sender.id,
            'sender_name': f"{msg.sender.first_name} {msg.sender.last_name}",
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
            'read': msg.read,
            'group_id': msg.group.id if msg.group else None
        } for msg in user_messages]
        
        return Response({'results': messages_data}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        content = request.data.get('content')
        receiver_id = request.data.get('receiver_id')
        group_id = request.data.get('group_id')
        
        message = Message.objects.create(
            sender=request.user,
            receiver_id=receiver_id if receiver_id else None,
            group_id=group_id if group_id else None,
            content=content
        )
        
        return Response({
            'id': message.id,
            'content': message.content,
            'created_at': message.created_at.isoformat()
        }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    if request.user.role != 'admin':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        group = Group.objects.get(id=group_id)
        group.delete()
        return Response({'message': 'Groupe supprimé'}, status=status.HTTP_200_OK)
    except Group.DoesNotExist:
        return Response({'error': 'Groupe non trouvé'}, status=status.HTTP_404_NOT_FOUND)