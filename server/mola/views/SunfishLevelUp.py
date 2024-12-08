from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Sunfish, Contribution


class SunfishLevelUpView(APIView):
    def post(self, request):
        try:
            from datetime import date
            today = date.today()
            contributions_today = Contribution.get_today_contributions()

            # 모든 Sunfish 순회
            sunfish_list = Sunfish.objects.all()
            for sunfish in sunfish_list:
                contribution_difference = contributions_today - sunfish.last_contribution_count

                # 기여도 차이가 있는 경우만 레벨업
                if contribution_difference > 0:
                    sunfish.calculate_level(contribution_difference)
                    sunfish.update_stage()

                    # 상태 갱신
                    sunfish.last_contribution_count = contributions_today
                    sunfish.last_updated = today
                    sunfish.save()

            return Response({"message": "Level-up completed for all Sunfish."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)