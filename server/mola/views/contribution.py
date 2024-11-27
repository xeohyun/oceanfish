from rest_framework.views import APIView
from rest_framework.response import Response
from mola.models import Contribution

# views.py
class ContributionAPI(APIView):
    def get(self, request):
        try:
            contributions = Contribution.objects.all().order_by('-date')
            data = [
                {
                    "date": contribution.date,
                    "count": contribution.count,
                    "sunfish": contribution.sunfish.name if contribution.sunfish else "No Sunfish",
                }
                for contribution in contributions
            ]
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
