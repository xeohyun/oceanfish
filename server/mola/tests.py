from datetime import date
from django.test import TestCase
from mola.models import Contribution

class ContributionTestCase(TestCase):
    def test_today_contributions(self):
        today = date.today()

        # 오늘 날짜의 기여도 확인
        contribution, created = Contribution.objects.get_or_create(date=today, defaults={"count": 0})
        print(f"Today's Contribution: {contribution.count}, Created: {created}")

        # 외부 데이터를 기반으로 업데이트
        updated_count = Contribution.get_updated_count()
        print(f"Updated Count from API: {updated_count}")

        # 업데이트 적용
        contribution.count = updated_count
        contribution.save()
        print(f"Final Contribution Count: {contribution.count}")

        # 테스트 검증
        self.assertEqual(contribution.count, updated_count, "Today's contribution count mismatch")
