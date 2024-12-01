from datetime import date
from rest_framework.response import Response
from rest_framework.views import APIView
from mola.models import Contribution

class ContributionAPI(APIView):
    def get(self, request):
        today = date.today()
        if not Contribution.objects.filter(date=today).exists():
            Contribution.objects.create(date=today, count=0)

        contributions = Contribution.objects.all().order_by('-date')
        data = [{"date": c.date, "count": c.count} for c in contributions]
        return Response(data)
