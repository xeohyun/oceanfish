from django.db import models
from datetime import date


class Sunfish(models.Model):
    name = models.CharField(max_length=100, default="Mola")
    level = models.IntegerField(default=1)
    stage = models.CharField(max_length=20, default="dust")  # 현재 단계
    is_alive = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)  # 마지막 업데이트 시간

    def __str__(self):
        return f"{self.name} - Level {self.level}, Stage {self.stage}"

    def calculate_level(self, contributions_today):
        """
        Update the level based on today's contributions.
        Max level increase per day: 4.
        """
        if not self.is_alive:
            return  # 죽은 Sunfish는 레벨업 불가능

        max_daily_level_up = 4
        level_increase = min(contributions_today, max_daily_level_up)
        self.level += level_increase
        self.update_stage()  # 레벨 변경에 따른 단계 업데이트
        self.save()

    def update_stage(self):
        """Update the stage based on the level."""
        if self.level >= 1 and self.level <= 3:
            self.stage = "dust"
        elif self.level >= 4 and self.level <= 10:
            self.stage = "baby"
        elif self.level >= 11 and self.level <= 30:
            self.stage = "adult"
        elif self.level >= 31:
            self.stage = "king"
        self.save()


class Contribution(models.Model):
    date = models.DateField(default=date.today)  # 기여 날짜
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.date}: {self.count}"

    @staticmethod
    def get_today_contributions():
        """
        Return the total contributions made today.
        """
        today = date.today()
        contributions = Contribution.objects.filter(date=today).aggregate(total=models.Sum('count'))
        return contributions['total'] or 0
