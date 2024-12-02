import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from decouple import config
from datetime import date
from mola.models import Sunfish, Contribution

class GitHubContributionAPI(APIView):
    def get(self, request, username):
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

            return JsonResponse({"message": "Contributions successfully fetched and saved", "username": username})

        return JsonResponse({"error": "Failed to fetch contributions"}, status=response.status_code)
