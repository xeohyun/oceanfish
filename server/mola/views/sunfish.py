from rest_framework.views import APIView
from rest_framework.response import Response
from mola.models import Sunfish

class SunfishAPI(APIView):
    def get(self, request):
        try:
            sunfish_list = Sunfish.objects.all()  # 모든 Sunfish 가져오기
            data = [
                {
                    "name": sunfish.name,
                    "level": sunfish.level,
                    "is_alive": sunfish.is_alive,
                    "creation_date": sunfish.creation_date,
                }
                for sunfish in sunfish_list
            ]
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
