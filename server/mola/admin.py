from django.contrib import admin
from .models import Sunfish, Contribution

@admin.register(Sunfish)
class SunfishAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'is_alive', 'creation_date')
    list_filter = ('is_alive', 'creation_date')
    search_fields = ('name',)
    ordering = ('-creation_date',)

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('date', 'count')  # 'source' 및 'sunfish' 제거
    list_filter = ('date',)  # 'sunfish' 및 'source' 제거
    ordering = ('-date',)  # 최신 날짜 순으로 정렬
