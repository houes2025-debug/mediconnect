from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.generic import TemplateView
from django.core.management import call_command
from django.conf import settings
from django.http import JsonResponse

import io

def run_migrations_temp(request):
    if request.GET.get('key') != '12345':
        return JsonResponse({'error': 'forbidden'}, status=403)
    out = io.StringIO()
    call_command('migrate', stdout=out, verbosity=2)
    return JsonResponse({
        'output': out.getvalue(),
        'db_host': settings.DATABASES['default'].get('HOST'),
        'db_name': settings.DATABASES['default'].get('NAME'),
    })


urlpatterns = [
    path('admins/', admin.site.urls),
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/results/', include('results.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/chat/', include('chat.urls')),
    
    # JWT refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('migrations/', run_migrations_temp),          # ← AVANT le catch-all

    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)