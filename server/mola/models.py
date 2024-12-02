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

    def __str__(self):
        return f"{self.name} - Level {self.level}, Stage {self.stage}"

    def calculate_level(self, contributions_today):
        """
        Update the level based on today's contributions.
        Max level increase per day: 4.
        """
        if not self.is_alive:
            return  # Dead Sunfish cannot level up

        max_daily_level_up = 4
        level_increase = min(contributions_today, max_daily_level_up)
        self.level += level_increase
        self.update_stage()  # Update stage based on new level
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
