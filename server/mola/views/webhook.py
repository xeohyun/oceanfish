"""
import hmac
import hashlib
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from datetime import datetime
from mola.models import Contribution
from server.settings import GITHUB_WEBHOOK_SECRET


@method_decorator(csrf_exempt, name="dispatch")
class GitHubWebhook(APIView):
    def post(self, request):
        # Verify the webhook signature
        signature = request.headers.get("X-Hub-Signature-256")
        if not self.verify_signature(request.body, signature):
            return JsonResponse({"error": "Invalid signature"}, status=403)

        try:
            payload = json.loads(request.body)
            print(f"Received payload: {payload}")
            event = request.headers.get("X-GitHub-Event")

            # Handle only push event
            if event == "push":
                self.handle_push_event(payload)
                return JsonResponse({"status": "Push event processed successfully"})

            return JsonResponse({"error": "Unsupported event"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def verify_signature(self, payload, signature):
        #Verify the HMAC-SHA256 signature.
        if not GITHUB_WEBHOOK_SECRET or not signature:
            return False

        # Compute the HMAC digest
        digest = hmac.new(
            key=GITHUB_WEBHOOK_SECRET.encode(),
            msg=payload,
            digestmod=hashlib.sha256,
        ).hexdigest()
        # Compare signatures securely
        return hmac.compare_digest(f"sha256={digest}", signature)

    def handle_push_event(self, payload):
        #Handle GitHub push events and save contributions.
        try:
            commits = payload.get("commits", [])
            commit_count = len(commits)

            # Parse pushed_at field from the repository metadata
            pushed_at = payload.get("repository", {}).get("pushed_at")
            pushed_date = self.parse_pushed_at(pushed_at)
            print(f"Parsed pushed_at: {pushed_date}")

            if not pushed_date:
                raise ValueError("Invalid pushed_at field format")

            # Extract user info from pusher field
            pusher = payload.get("pusher", {}).get("name", "unknown_user")
            print(f"Pusher: {pusher}")

            # Save or update contributions for the specific user and date
            contribution, created = Contribution.objects.update_or_create(
                date=pushed_date.date(),
                user=pusher,
                defaults={
                    "count": contribution.count + commit_count if not created else commit_count
                },
            )
            print(f"Updated contribution: {contribution}")

        except Exception as e:
            print(f"Error in handle_push_event: {e}")
            raise e

    def parse_pushed_at(self, pushed_at):
        #Helper function to parse pushed_at field into a datetime object.
        try:
            if isinstance(pushed_at, int):
                # Handle Unix timestamp
                return datetime.fromtimestamp(pushed_at)
            elif isinstance(pushed_at, str):
                # Handle ISO8601 format
                return datetime.strptime(pushed_at, "%Y-%m-%dT%H:%M:%SZ")
        except ValueError as e:
            print(f"Error parsing pushed_at: {e}")
        print("Unsupported pushed_at format")
        return None

"""