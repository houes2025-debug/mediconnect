from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone', 'date_of_birth', 'profile_picture', 
                  'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id','username', 'email', 'password', 'password2', 
                  'first_name', 'last_name', 'phone', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        if validated_data['role'] == 'admin' :
            validated_data['username'] = validated_data['email']
            user = User.objects.create_user(**validated_data)
            return user
        elif validated_data['role'] == 'doctor' :
            validated_data['username'] = validated_data['email']
            user = User.objects.create_user(**validated_data)

            return user
        user = User.objects.create_user(**validated_data)
        return user
        
    