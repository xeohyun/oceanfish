from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('mola.urls')),  # mola 앱의 URL을 포함
]
