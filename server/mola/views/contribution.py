from rest_framework.views import APIView
from rest_framework.response import Response
from mola.models import Sunfish, Contribution

class ContributionAPI(APIView):
    def get(self, request):
        try:
            # 모든 Contribution 데이터를 JSON 형식으로 반환
            contributions = Contribution.objects.all().order_by('-date')
            data = [{"date": c.date, "count": c.count, "sunfish": c.sunfish.name} for c in contributions]
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

