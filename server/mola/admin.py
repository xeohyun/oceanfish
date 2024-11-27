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
    list_display = ('sunfish_name', 'date', 'count', 'source')  # Sunfish 이름과 기타 필드 표시
    list_filter = ('date', 'sunfish', 'source')  # Sunfish를 외래 키로 필터링
    search_fields = ('sunfish__name', 'source')  # Sunfish 이름 및 출처로 검색 가능
    ordering = ('-date',)

    # Sunfish 이름을 list_display에서 사용할 수 있도록 커스텀 메서드 정의
    def sunfish_name(self, obj):
        return obj.sunfish.name if obj.sunfish else "No Sunfish"
    sunfish_name.short_description = "Sunfish Name"
