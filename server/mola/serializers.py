from rest_framework import serializers
from .models import Sunfish, Contribution

class SunfishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sunfish
        fields = ['id', 'name', 'level', 'is_alive', 'creation_date']

class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ['id', 'date', 'count', 'sunfish']
