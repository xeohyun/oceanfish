from datetime import date, timedelta
from django.http import JsonResponse
from rest_framework.views import APIView
from ..models import Contribution, Sunfish

class ContributionAPI(APIView):
    def get(self, request, sunfish_id=None):
        try:
            import os
            username = os.getenv("GITHUB_USERNAME") # GitHub 사용자 이름 설정
            today = date.today()

            # Sunfish가 존재하는지 확인
            if sunfish_id is not None:
                try:
                    sunfish = Sunfish.objects.get(id=sunfish_id)
                except Sunfish.DoesNotExist:
                    return JsonResponse({"error": "Sunfish not found"}, status=404)

            # 오늘의 Contribution 생성 또는 동기화
            contribution, created = Contribution.get_or_create(
                date=today,
                defaults={"count": Contribution.fetch_commit_count(username)}
            )

            if not created:
                # 외부 데이터와 동기화
                updated_count = Contribution.fetch_commit_count(username)
                if contribution.count != updated_count:
                    contribution.count = updated_count
                    contribution.save()

            # 특정 Sunfish ID에 대한 최근 기여도 데이터 반환
            if sunfish_id is not None:
                contributions = Contribution.objects.filter(
                    date__gte=sunfish.creation_date,  # Sunfish 생성일 이후
                    date__lte=today  # 오늘까지
                ).order_by('-date')
            else:
                # 전체 기여도 데이터 반환 (기본 동작)
                one_year_ago = today - timedelta(days=365)
                contributions = Contribution.objects.filter(
                    date__gte=one_year_ago
                ).order_by('-date')

            # 데이터 직렬화
            data = [{"date": c.date.isoformat(), "count": c.count} for c in contributions]

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
