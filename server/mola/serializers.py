from .models import Sunfish, Contribution
from datetime import date
from rest_framework import serializers
from mola.models import Sunfish, Contribution

class SunfishSerializer(serializers.ModelSerializer):
    daily_contribution = serializers.SerializerMethodField()

    class Meta:
        model = Sunfish
        fields = ['id', 'name', 'level', 'is_alive', 'creation_date', 'daily_contribution']

    def get_daily_contribution(self, obj):
        # 오늘 날짜의 기여도 계산
        today = date.today()
        contributions_today = Contribution.objects.filter(sunfish=obj, date=today).aggregate(total=models.Sum('count'))
        return contributions_today['total'] or 0


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['id', 'date', 'count', 'sunfish']
