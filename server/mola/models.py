from django.db import models
from datetime import date
import requests
import os
import datetime
from cachetools import TTLCache
from dotenv import load_dotenv

load_dotenv()

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

    cache = TTLCache(maxsize=10, ttl=3600)  # 캐싱: 최대 10개, 1시간 유지
    last_request_time = None
    REQUEST_LIMIT_SECONDS = 60

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

    @staticmethod
    def get_updated_count():
        """
        Fetch the latest contribution count from an external API with pagination.
        """
        try:
            username = "xeohyun"
            token = os.getenv("GITHUB_ACCESS_TOKEN")

            if not token:
                raise Exception("GITHUB_ACCESS_TOKEN is not set in environment variables.")

            headers = {"Authorization": f"token {token}"}
            events = []
            page = 1
            today = datetime.date.today()

            while True:
                response = requests.get(
                    f'https://api.github.com/users/{username}/events?page={page}',
                    headers=headers
                )

                if response.status_code != 200:
                    raise Exception(f"Failed to fetch data: {response.status_code}")

                page_events = response.json()
                if not page_events:
                    break  # No more events to fetch

                # Debug: 출력 확인
                print(f"Page {page}: {len(page_events)} events fetched.")

                # PushEvent 필터링 및 날짜 확인
                push_events = [
                    event for event in page_events
                    if event['type'] == 'PushEvent' and
                       datetime.date.fromisoformat(event['created_at'][:10]) == today
                ]

                events.extend(push_events)
                page += 1

            total_push_events = len(events)
            print(f"Total Push Events for Today: {total_push_events}")
            return total_push_events

        except Exception as e:
            print(f"Error fetching updated count: {e}")
            return 0

    @staticmethod
    def fetch_commit_count(username):
        """
        Fetch and count the total number of commits for a GitHub user today.
        """
        try:
            token = os.getenv("GITHUB_ACCESS_TOKEN")

            if not token:
                raise Exception("GITHUB_ACCESS_TOKEN is not set in environment variables.")

            headers = {"Authorization": f"token {token}"}
            today = datetime.date.today()
            total_commits = 0
            page = 1

            while True:
                # GitHub API 요청
                response = requests.get(
                    f'https://api.github.com/users/{username}/events?page={page}',
                    headers=headers
                )

                if response.status_code != 200:
                    raise Exception(f"Failed to fetch data: {response.status_code}")

                page_events = response.json()
                if not page_events:
                    break  # 더 이상 가져올 이벤트가 없으면 종료

                # PushEvent에서 커밋 횟수 집계
                for event in page_events:
                    if event['type'] == 'PushEvent':
                        event_date = datetime.date.fromisoformat(event['created_at'][:10])
                        if event_date == today:
                            print(f"total_commits: Processed {len(event['payload']['commits'])} events.")
                            total_commits += len(event['payload']['commits'])

                print(f"Page {page}: Processed {len(page_events)} events.")
                page += 1

            print(f"Total commits for today: {total_commits}")
            return total_commits

        except Exception as e:
            print(f"Error fetching commit count: {e}")
            return 0

    # Example 사용법
    if __name__ == "__main__":
        username = "xeohyun"
        fetch_commit_count(username)