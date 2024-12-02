from datetime import date, timedelta
from django.http import JsonResponse
from rest_framework.views import APIView
from ..models import Contribution

class ContributionAPI(APIView):
    def get(self, request):
        try:
            username = "xeohyun"  # GitHub 사용자 이름 설정
            today = date.today()

            # 오늘의 Contribution 생성 또는 동기화
            contribution, created = Contribution.get_or_create(
                date=today,
                defaults={"count": Contribution.fetch_commit_count(username)}
            )
            print(contribution, created)
            if not created:
                # 존재하지 않으면 외부 데이터와 동기화
                updated_count = Contribution.fetch_commit_count(username)
                print(contribution.count)
                if contribution.count != updated_count:
                    contribution.count = updated_count
                    contribution.save()

            # 최근 1년간의 기여도 데이터를 가져오기
            one_year_ago = today - timedelta(days=365)
            contributions = Contribution.objects.filter(
                date__gte=one_year_ago
            ).order_by('-date')

            # 데이터 직렬화
            data = [{"date": c.date.isoformat(), "count": c.count} for c in contributions]

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
