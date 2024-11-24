from rest_framework.views import APIView
from rest_framework.response import Response
from mola.models import Sunfish, Contribution

class SunfishAPI(APIView):
    def get(self, request):
        try:
            # 현재 활성화된 Sunfish 객체 가져오기
            sunfish = Sunfish.objects.filter(is_alive=True).first()
            if sunfish:
                # 최근 날짜의 기여도를 계산하여 반환
                recent_contribution = Contribution.objects.filter(sunfish=sunfish).order_by('-date').first()
                daily_contribution = recent_contribution.count if recent_contribution else 0

                return Response({
                    "level": sunfish.level,
                    "is_alive": sunfish.is_alive,
                    "daily_contribution": daily_contribution
                })

            return Response({"error": "No active sunfish found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
