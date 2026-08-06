from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Group(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    doctors = models.ManyToManyField(User, related_name='doctor_groups', limit_choices_to={'role': 'doctor'})
    patients = models.ManyToManyField(User, related_name='patient_groups', limit_choices_to={'role': 'patient'})
    admins = models.ManyToManyField(User, related_name='admin_groups', limit_choices_to={'role': 'admin'})
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_groups')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def message_count(self):
        return self.messages.count()


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        if self.group:
            return f"{self.sender.username} in {self.group.name}: {self.content[:50]}"
        return f"{self.sender.username} to {self.receiver.username if self.receiver else 'Unknown'}: {self.content[:50]}"