from rest_framework import serializers
from .models import MedicalResult
from accounts.serializers import UserSerializer

class MedicalResultSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = MedicalResult
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class MedicalResultCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalResult
        fields = ['title', 'type', 'description', 'file',  
                  'details', 'date_examination', 'patient', 'doctor']