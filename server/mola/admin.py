from django.contrib import admin
from .models import Sunfish, Contribution

# 커스텀 액션 정의
def delete_selected_sunfish(modeladmin, request, queryset):
    queryset.delete()  # 선택된 객체 삭제
    modeladmin.message_user(request, "선택된 Sunfish가 성공적으로 삭제되었습니다.")

delete_selected_sunfish.short_description = "선택된 Sunfish 삭제"

@admin.register(Sunfish)
class SunfishAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'is_alive', 'creation_date')
    list_filter = ('is_alive', 'creation_date')
    search_fields = ('name',)
    ordering = ('-creation_date',)
    actions = [delete_selected_sunfish]

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('date', 'count')  # 'source' 및 'sunfish' 제거
    list_filter = ('date',)  # 'sunfish' 및 'source' 제거
    ordering = ('-date',)  # 최신 날짜 순으로 정렬



