# backend/mediconnect/results/admin.py
from django.contrib import admin
from .models import MedicalResult

@admin.register(MedicalResult)
class MedicalResultAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'patient', 'doctor', 'type', 'status',
        'reste_a_payer', 'date_examination', 'created_at',
    )
    list_filter = ('reste_a_payer', 'status', 'type', 'date_examination')
    search_fields = (
        'title', 'patient__username', 'patient__first_name', 'patient__last_name',
        'doctor__username', 'doctor__first_name', 'doctor__last_name',
    )
    date_hierarchy = 'date_examination'
    autocomplete_fields = ('patient', 'doctor')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-date_examination', '-created_at')