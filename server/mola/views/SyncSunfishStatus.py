from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from ..models import Sunfish, Contribution

class SyncSunfishStatus(APIView):
    """
    View for syncing Sunfish status based on yesterday's contributions.
    """
    def post(self, request):
        try:
            # Sunfish 데이터 가져오기
            sunfish_list = Sunfish.objects.all()
            today = date.today()
            yesterday = today - timedelta(days=1)

            # 어제의 기여도 가져오기
            yesterday_contribution = Contribution.objects.filter(date=yesterday).first()
            yesterday_count = yesterday_contribution.count if yesterday_contribution else 0

            # 기여도가 이미 처리되었는지 확인
            if yesterday_contribution.processed:
                return Response({
                    "message": "Contributions from yesterday have already been processed.",
                    "yesterday_contribution": yesterday_contribution.count,
                }, status=status.HTTP_200_OK)

            # 어제의 기여도가 0인 경우 상태 동기화
            if yesterday_count == 0:
                updated_sunfish = []
                for sunfish in sunfish_list.filter(is_alive=True):
                    sunfish.is_alive = False
                    sunfish.save()
                    updated_sunfish.append({
                        "id": sunfish.id,
                        "name": sunfish.name,
                        "level": sunfish.level,
                        "stage": sunfish.stage,
                        "is_alive": sunfish.is_alive,
                    })

                yesterday_contribution.processed = True
                yesterday_contribution.save()

                return Response({
                    "message": "Some Sunfish were marked as dead due to no contributions yesterday.",
                    "updated_sunfish": updated_sunfish,
                    "yesterday_contribution": yesterday_count,
                }, status=status.HTTP_200_OK)

            return Response({
                "message": "No changes made. Contributions from yesterday are sufficient.",
                "yesterday_contribution": yesterday_count,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
