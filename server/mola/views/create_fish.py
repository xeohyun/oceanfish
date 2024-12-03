from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from mola.models import Sunfish, Contribution

class CreateFishAPI(APIView):
    def post(self, request):
        name = request.data.get("name")
        print(name)
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 새로운 Sunfish 생성
            new_sunfish = Sunfish.create_fish(name=name)
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

        except ValueError as e:
            print(f"ValueError: {e}")  # Debugging 출력
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {e}")  # Debugging 출력
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)