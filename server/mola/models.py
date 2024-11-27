from django.db import models
from datetime import date, timedelta


class Sunfish(models.Model):
    name = models.CharField(max_length=100, default="Mola")
    level = models.IntegerField(default=1)
    stage = models.CharField(max_length=20, default="dust")  # 현재 단계
    is_alive = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)  # 마지막 기여 시간

    def __str__(self):
        return f"{self.name} - Level {self.level}, Stage {self.stage}"

    def can_create_new(self):
        """Return True if this Sunfish is dead."""
        return not self.is_alive


# models.py
class Contribution(models.Model):
    date = models.DateField()
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.date}: {self.count}"