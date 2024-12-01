from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from mola.models import Contribution

class Command(BaseCommand):
    help = "오늘과 누락된 날짜의 Contribution 데이터를 생성합니다."

    def handle(self, *args, **kwargs):
        today = now().date()  # 오늘 날짜
        start_date = today - timedelta(days=30)  # 최근 30일 기준으로 확인

        # 1. 지정된 날짜 범위 내의 Contribution 데이터 가져오기
        existing_contributions = Contribution.objects.filter(date__range=(start_date, today)).values_list('date', flat=True)

        # 2. 누락된 날짜 계산
        missing_dates = [
            start_date + timedelta(days=i)
            for i in range((today - start_date).days + 1)
            if (start_date + timedelta(days=i)) not in existing_contributions
        ]

        # 3. 누락된 날짜에 Contribution 데이터 생성
        for missing_date in missing_dates:
            Contribution.objects.create(date=missing_date, count=0)
            self.stdout.write(self.style.SUCCESS(f"Created Contribution for {missing_date}."))

        # 4. 오늘 날짜 데이터 확인 및 생성
        if today not in existing_contributions:
            Contribution.objects.create(date=today, count=0)
            self.stdout.write(self.style.SUCCESS(f"Today's Contribution created for {today}."))
        else:
            self.stdout.write(self.style.SUCCESS("Today's Contribution already exists."))
