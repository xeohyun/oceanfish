from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from mola.models import Sunfish, Contribution

class CreateFishAPI(APIView):
    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 죽은 Sunfish가 있거나, 레벨 50 이상인 Sunfish가 있을 때만 생성
            can_create = Sunfish.objects.filter(is_alive=False).exists() or \
                         Sunfish.objects.filter(level__gte=50).exists()
            if not can_create:
                return Response({"error": "Cannot create a new Sunfish at this time."}, status=status.HTTP_400_BAD_REQUEST)

            # 새로운 Sunfish 생성
            new_sunfish = Sunfish.objects.create(name=name)
            return Response({
                "message": "Sunfish created successfully",
                "sunfish": {
                    "id": new_sunfish.id,
                    "name": new_sunfish.name,
                    "level": new_sunfish.level,
                    "stage": new_sunfish.stage,
                    "is_alive": new_sunfish.is_alive,
                    "creation_date": new_sunfish.creation_date,
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
