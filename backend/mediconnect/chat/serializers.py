from rest_framework import serializers
from .models import ChatRoom, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    time = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def get_time(self, obj):
        return obj.created_at.strftime('%H:%M')

class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_last_message(self, obj):
        last = obj.messages.last()
        return MessageSerializer(last).data if last else None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.messages.filter(read=False).exclude(sender=request.user).count()
        return 0
    
    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user:
            other = obj.doctor if request.user == obj.patient else obj.patient
            from accounts.serializers import UserSerializer
            return UserSerializer(other).data
        return None