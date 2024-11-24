from django.core.management.base import BaseCommand
from django.utils.timezone import now
from mola.models import Sunfish, Contribution


class Command(BaseCommand):
    help = "Updates the level of sunfish and checks for sudden death conditions"

    def handle(self, *args, **kwargs):
        today = now().date()
        sunfish_list = Sunfish.objects.filter(is_alive=True).order_by('-creation_date')

        if not sunfish_list:
            self.stdout.write("No active sunfish found.")
            return

        for sunfish in sunfish_list:
            contributions = Contribution.objects.filter(sunfish=sunfish, date=today).first()

            # 기여도가 없는 경우
            if not contributions or contributions.count == 0:
                sunfish.is_alive = False
                sunfish.save()
                self.stdout.write(f"{sunfish.name} has died due to no contributions today.")
                break  # 가장 최근 생성된 개복치부터 돌연사

            # 레벨 업 계산
            max_level_gain = min(contributions.count, 4)
            sunfish.level += max_level_gain
            sunfish.save()

            # 성장 완료 시 처리
            if sunfish.level > 50:
                sunfish.is_alive = False  # 성장 완료된 개복치는 생존 종료
                sunfish.save()
                Sunfish.objects.create()  # 새로운 개복치 생성
                self.stdout.write(f"{sunfish.name} has reached maximum growth. A new sunfish has been created.")
