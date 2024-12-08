from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from django.db.models import Sum
from mola.models import Sunfish, Contribution


class SunfishAPI(APIView):
    def post(self, request):
        try:
            print("POST request received")
            name = request.data.get("name")
            if not name:
                return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Sunfish 데이터 가져오기
            sunfish_list = Sunfish.objects.all()
            today = date.today()
            yesterday = today - timedelta(days=1)

            # 어제의 기여도 가져오기
            yesterday_contribution = Contribution.objects.filter(date=yesterday).first()
            print(yesterday_contribution)
            if yesterday_contribution:
                yesterday_count = yesterday_contribution.count
            else:
                yesterday_count = 0

            # 어제의 기여도가 0인 경우
            if yesterday_count == 0:
                # 성장 중인 가장 최근 Sunfish 가져오기 (50레벨 미만)
                growing_sunfish = sunfish_list.filter(level__lt=50, is_alive=True).first()

                if growing_sunfish:
                    # Sunfish를 죽은 상태로 변경
                    growing_sunfish.is_alive = False
                    growing_sunfish.save()
                else:
                    # 성장 중인 Sunfish가 없을 경우, 아무 작업도 수행하지 않음.
                    return Response({"message": "No growing Sunfish available to terminate."}, status=status.HTTP_200_OK)

                # 새로운 Sunfish 생성
                new_sunfish = Sunfish.objects.create(name=name)
                return Response({
                    "message": "New Sunfish created after terminating the previous one.",
                    "sunfish": {
                        "id": new_sunfish.id,
                        "name": new_sunfish.name,
                        "level": new_sunfish.level,
                        "stage": new_sunfish.stage,
                        "is_alive": new_sunfish.is_alive,
                        "creation_date": new_sunfish.creation_date,
                    }
                }, status=status.HTTP_201_CREATED)

            return Response({"message": "No action required. Yesterday's contributions were sufficient."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            # Sunfish 데이터 가져오기
            sunfish_list = Sunfish.objects.all().order_by('-creation_date')
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
                    print(sunfish.stage)

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
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
