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
    list_display = ('sunfish', 'date', 'count')
    list_filter = ('date',)
    search_fields = ('sunfish__name',)
    ordering = ('-date',)
