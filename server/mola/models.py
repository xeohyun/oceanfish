from wsgiref.util import request_uri

from django.db import models
from datetime import date, datetime
import requests
import os
from cachetools import TTLCache
from dotenv import load_dotenv
from decouple import config

# Load environment variables from .env file
load_dotenv()

class Sunfish(models.Model):
    name = models.CharField(max_length=100, default="Mola")
    level = models.IntegerField(default=1)
    stage = models.CharField(max_length=20, default="dust")  # Current stage
    is_alive = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)  # Last updated timestamp
    last_contribution_count = models.IntegerField(default=0)  # 어제까지의 기여도

    def __str__(self):
        return f"{self.name} - Level {self.level}, Stage {self.stage}"

    def calculate_level(self, contributions_today):
        """
        Update the level based on today's contributions.
        Max level increase per day: 4.
        """
        if not self.is_alive:
            return  # Dead Sunfish cannot level up

        # Define level increase rules based on contributions
        if contributions_today == 1:
            level_increase = 1
        elif 2 <= contributions_today <= 5:
            level_increase = 2
        elif 6 <= contributions_today <= 10:
            level_increase = 3
        elif contributions_today >= 11:
            level_increase = 4
        else:
            level_increase = 0  # No contributions, no level increase

        # Ensure the level increase does not exceed the daily maximum
        max_daily_level_up = 4
        level_increase = min(level_increase, max_daily_level_up)

        # Update the level
        self.level += level_increase
        if self.level >= 50:
            self.level = 50  # Cap the level at 50
            self.save()
            return

        # Update the stage based on the new level
        self.update_stage()
        self.save()

    def update_stage(self):
        """Update the stage based on the level."""
        if self.level <= 3:
            self.stage = "dust"
        elif 4 <= self.level <= 10:
            self.stage = "baby"
        elif 11 <= self.level <= 30:
            self.stage = "adult"
        elif self.level >= 31:
            self.stage = "king"
        self.save()

    @staticmethod
    def create_fish(name):
        """
        Create a new Sunfish if the most recently active Sunfish has either:
        1. Reached level 50, or
        2. Is in a dead state (is_alive=False).
        """
        # 가장 최근까지 성장한 Sunfish 가져오기 (creation_date 순으로 정렬)
        latest_sunfish = Sunfish.objects.order_by('-creation_date').first()

        # 최근 Sunfish가 없는 경우 (첫 Sunfish 생성)
        if not latest_sunfish:
            return Sunfish.objects.create(
                name=name,
                level=1,
                stage="dust",
                is_alive=True
            )
            # 최근 Sunfish가 50레벨에 도달하거나 죽은 상태인 경우 새로운 Sunfish 생성
        if latest_sunfish.level >= 50 or not latest_sunfish.is_alive:
            return Sunfish.objects.create(
                name=name,
                level=1,
                stage="dust",
                is_alive=True
            )

            # 조건이 충족되지 않으면 예외 발생
        raise ValueError("Cannot create a new Sunfish: The latest Sunfish is still growing.")


class Contribution(models.Model):
    date = models.DateField(default=date.today)  # Contribution date
    count = models.IntegerField(default=0)

    cache = TTLCache(maxsize=10, ttl=3600)  # Cache: max 10 entries, 1 hour TTL

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

    @classmethod
    def fetch_commit_count(self, username):
        GITHUB_ACCESS_TOKEN = config('GITHUB_ACCESS_TOKEN')

        url = "https://api.github.com/graphql"
        headers = {
            "Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }
        query = """
                query($username: String!) {
                    user(login: $username) {
                        contributionsCollection {
                            contributionCalendar {
                                weeks {
                                  contributionDays {
                                    contributionCount
                                    date
                                  }
                                }
                            }
                        }
                    }
                }
                """
        body = {
            "query": query,
            "variables": {"username": username},
        }

        response = requests.post(url, json=body, headers=headers)
        if response.status_code == 200:
            data = response.json()

            weeks = data['data']['user']['contributionsCollection']['contributionCalendar']['weeks'][-1:]

            # 오늘 날짜 가져오기
            today = date.today().isoformat()

            # 오늘 날짜와 일치하는 객체 찾기
            def find_today_contribution(data, today):
                for item in data:
                    if "contributionDays" in item:
                        for contribution in item["contributionDays"]:
                            if contribution["date"] == today:
                                return contribution
                return None

            # 함수 실행
            result = find_today_contribution(weeks, today)
            print(result)

            if result:
                return result['contributionCount']

        return 0

    @classmethod
    def get_or_create(cls, date, defaults=None):
        """
        Custom get_or_create method for Contribution model.

        Args:
            date (datetime.date): The date for the contribution record.
            defaults (dict): Default values for the new record.

        Returns:
            (Contribution, bool): The contribution instance and a boolean
            indicating if it was created (True) or fetched (False).
        """
        defaults = defaults or {}
        try:
            # Try to get the existing contribution
            contribution = cls.objects.get(date=date)
            created = False
        except cls.DoesNotExist:
            # Create a new contribution if it does not exist
            contribution = cls.objects.create(date=date, **defaults)
            created = True

        """contribution_data = {
        'date': contribution.date.strftime("%Y-%m-%d"),  # Format the date
        'count': contribution.count,
        }"""
        return contribution, created
