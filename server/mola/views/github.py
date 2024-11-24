import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from decouple import config
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
                                date
                                contributionCount
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
            weeks = data['data']['user']['contributionsCollection']['contributionCalendar']['weeks']

            # 활성화된 Sunfish 객체 가져오기
            active_sunfish = Sunfish.objects.filter(is_alive=True).first()
            if not active_sunfish:
                return JsonResponse({"error": "No active sunfish found"}, status=404)

            for week in weeks:
                for day in week['contributionDays']:
                    Contribution.objects.update_or_create(
                        sunfish=active_sunfish,  # 활성화된 sunfish와 연결
                        date=day['date'],
                        defaults={'count': day['contributionCount']}
                    )
            return JsonResponse(data)

        return JsonResponse({"error": "Failed to fetch contributions"}, status=response.status_code)
