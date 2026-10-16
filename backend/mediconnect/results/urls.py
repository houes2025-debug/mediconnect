from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.MedicalResultViewSet, basename='result')

urlpatterns = [
    path('', include(router.urls)),
    #path('results/by-n_dossier/', views.get_result_by_n_dossier, name='get_result_by_n_dossier'),
]