from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.messages, name='messages'),
    path('groups/', views.groups, name='groups'),
    path('groups/<int:group_id>/', views.delete_group, name='delete_group'),
]