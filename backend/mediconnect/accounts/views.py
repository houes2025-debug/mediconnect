from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model,authenticate, update_session_auth_hash
import os
import secrets
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserFile
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.hashers import make_password
from django.utils.dateparse import parse_date
from datetime import datetime

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    print(username,email,password)

    # Essayer avec username ou email
    user = None
    if username != "" :
        user = User.objects.filter(username=username).first()
        print(user,user)
    elif email != "":
        user = User.objects.filter(email=email).first()
    

    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        print("ggg",refresh.access_token)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        })
    
    return Response({'error': 'Identifiants incorrects'}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_patients(request):
        patients = User.objects.filter(role='patient')
        serializer = UserSerializer(patients, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    patients = User.objects.all()
    serializer = UserSerializer(patients, many=True)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt   # à remplacer par un vrai token plus tard
@permission_classes([AllowAny])
def upload_pdf(request):
    print('upload')
    
    if request.method == 'POST' and request.FILES.get('file'):
        print('upload2')
        username=request.POST.get('username')
        print('username',username)
        uploaded_file = request.FILES['file']
        print('file',uploaded_file)
        user, created = User.objects.get_or_create(
            username=username
                  
        )

        # 2) enregistrer le fichier
        user_file = UserFile.objects.create(user=user, file=uploaded_file)

        # 3) réponse JSON
        return JsonResponse({
            'status': 'ok',
            'user_id': user.id,
            'username': user.username,
            
            'file_url': user_file.file.url,        # /media/uploads/...
            'file_name': user_file.filename(),
            'created': created,
        })

    return JsonResponse({'status': 'error',
                         'message': 'Méthode ou fichier manquant'}, status=400)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    print("Headers reçus :", request.headers)
    print("Authorization :", request.headers.get('Authorization'))
    print("Body reçu :", request.data)

    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    new_password_confirm = request.data.get('new_password_confirm')
    
    # Validation
    if not old_password or not new_password or not new_password_confirm:
        return Response({
            'error': 'Tous les champs sont requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérifier l'ancien mot de passe
    if not user.check_password(old_password):
        return Response({
            'error': 'Ancien mot de passe incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérifier la confirmation
    if new_password != new_password_confirm:
        return Response({
            'error': 'Les mots de passe ne correspondent pas'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Vérifier la longueur minimale
    if len(new_password) < 8:
        return Response({
            'error': 'Le mot de passe doit contenir au moins 8 caractères'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Changer le mot de passe
    user.set_password(new_password)
    user.save()
    
    # Maintenir la session active après changement
    update_session_auth_hash(request, user)
    
    return Response({
        'message': 'Mot de passe changé avec succès'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])  # le médecin doit être connecté pour chercher
def get_patient_by_username(request):
    """
    GET /api/patients/by-username/?username=xxx
    Renvoie l'id du patient correspondant à ce username, s'il existe.
    """
    username = request.query_params.get('username', '').strip()
    print(f"Recherche du patient par username : '{username}'")
    if not username:
        return Response({"error": "Le paramètre 'username' est requis."}, status=400)

    try:
        user = User.objects.get(username__iexact=username)
    except User.DoesNotExist:
        return Response({"error": "Aucun utilisateur trouvé."}, status=404)

    # Adapte selon ton architecture : soit user.patient.id (OneToOne),
    # soit directement user.id si User et Patient sont fusionnés
    if hasattr(user, 'patient'):
        return Response({"patient_id": user.patient.id, "user_id": user.id})
    else:
        return Response({"patient_id": user.id, "user_id": user.id})