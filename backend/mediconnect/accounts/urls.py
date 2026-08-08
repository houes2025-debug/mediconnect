from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('patients/', views.list_patients, name='list_patients'),
    path('users/', views.list_users, name='list_users'),
    path('change-password/', views.change_password, name='change_password'),
    path('upload-pdf/', views.upload_pdf, name='upload_pdf'),
    path('patients/by-username/', views.get_patient_by_username, name='patient-by-username'),
    # urls.py

]