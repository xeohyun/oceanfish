from datetime import date, timedelta
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from mola.models import Contribution



class ContributionAPI(APIView):
    def get(self, request):
        try:
            today = date.today()
            contribution, created = Contribution.objects.get_or_create(
                date=today,
                defaults={"count": Contribution.get_updated_count()}
            )

            if not created:
                # 이미 존재하면 외부 데이터와 동기화
                updated_count = Contribution.get_updated_count()
                if contribution.count != updated_count:
                    contribution.count = updated_count
                    contribution.save()

            contributions = Contribution.objects.filter(
                date__gte=date.today() - timedelta(days=365)
            ).order_by('-date')
            data = [{"date": c.date, "count": c.count} for c in contributions]
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
