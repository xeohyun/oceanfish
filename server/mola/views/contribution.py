from rest_framework.views import APIView
from rest_framework.response import Response
from mola.models import Contribution

class ContributionAPI(APIView):
    def get(self, request):
        try:
            contributions = Contribution.objects.all().order_by('-date')
            data = [
                {
                    "date": contribution.date,
                    "count": contribution.count,
                }
                for contribution in contributions
            ]
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
