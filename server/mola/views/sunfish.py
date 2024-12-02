from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
from mola.models import Sunfish
from mola.models import Contribution


class SunfishAPI(APIView):
    def get(self, request):
        try:
            # Sunfish 데이터 가져오기
            sunfish_list = Sunfish.objects.all()
            today = date.today()

            data = []
            for sunfish in sunfish_list:
                # 오늘의 기여도 가져오기
                contributions_today = Contribution.get_today_contributions()

                contribution_difference = contributions_today - sunfish.last_contribution_count

                # 기여도 차이가 있는 경우만 레벨업
                if contribution_difference > 0:
                    # 오늘의 기여도를 반영한 레벨업
                    sunfish.calculate_level(contribution_difference)
                    sunfish.update_stage()

                    # 상태 갱신
                    sunfish.last_contribution_count = contributions_today
                    sunfish.last_updated = today  # 마지막 업데이트 날짜를 오늘로 설정
                    sunfish.save()

                # Sunfish 데이터를 JSON 형태로 변환
                data.append({
                    "id": sunfish.id,
                    "name": sunfish.name,
                    "level": sunfish.level,
                    "stage": sunfish.stage,
                    "is_alive": sunfish.is_alive,
                    "creation_date": sunfish.creation_date,
                    "last_updated": sunfish.last_updated,
                })

            return Response(data)  # 배열 반환

        except Exception as e:
            return Response({"error": str(e)}, status=500)
