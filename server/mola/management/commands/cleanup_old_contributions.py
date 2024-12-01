from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from mola.models import Contribution

class Command(BaseCommand):
    help = "1년이 지난 Contribution 데이터를 삭제합니다."

    def handle(self, *args, **kwargs):
        cutoff_date = now().date() - timedelta(days=365)  # 오늘 기준 1년 이전 날짜
        old_contributions = Contribution.objects.filter(date__lt=cutoff_date)

        if old_contributions.exists():
            count = old_contributions.count()
            old_contributions.delete()
            self.stdout.write(self.style.SUCCESS(f"Deleted {count} contributions older than {cutoff_date}."))
        else:
            self.stdout.write(self.style.SUCCESS("No contributions older than 1 year to delete."))
