from django.db import models
from django.conf import settings

class MedicalResult(models.Model):
    STATUS_CHOICES = [
        ('new', 'Nouveau'),
        ('viewed', 'Vu'),
        ('downloaded', 'Téléchargé'),
    ]
    
    TYPE_CHOICES = [
        ('blood_test', 'Analyse sanguine'),
        ('xray', 'Radiographie'),
        ('ecg', 'ECG'),
        ('mri', 'IRM'),
        ('ultrasound', 'Échographie'),
        ('other', 'Autre'),
    ]
    
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='results')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='prescribed_results')
    
    title = models.CharField(max_length=255, default="",null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES,null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='new')
    
    file = models.FileField(upload_to='results/%Y/%m/')
    #hospital = models.CharField(max_length=255, blank=True)
    
    # Détails en JSON pour flexibilité
    details = models.JSONField(default=dict, blank=True, null=True)
    
    date_examination = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True,blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.patient.get_full_name()}"
    
    class Meta:
        ordering = ['-date_examination', '-created_at']