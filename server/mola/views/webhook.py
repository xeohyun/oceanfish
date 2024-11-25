import hmac
import hashlib
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from mola.models import Contribution, Sunfish
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
            event = request.headers.get("X-GitHub-Event")

            # Handle push event
            if event == "push":
                self.handle_push_event(payload)
                return JsonResponse({"status": "Push event processed successfully"})

            return JsonResponse({"error": "Unsupported event"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid payload"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def verify_signature(self, payload, signature):
        if not GITHUB_WEBHOOK_SECRET or not signature:
            return False
        digest = hmac.new(
            key=GITHUB_WEBHOOK_SECRET.encode(),
            msg=payload,
            digestmod=hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(f"sha256={digest}", signature)

    def handle_push_event(self, payload):
        pusher_name = payload.get("pusher", {}).get("name", "unknown")
        commits = payload.get("commits", [])
        commit_count = len(commits)

        # Update the Sunfish model based on the push
        active_sunfish = Sunfish.objects.filter(is_alive=True).first()
        if active_sunfish:
            Contribution.objects.create(
                sunfish=active_sunfish, date=payload.get("repository", {}).get("pushed_at"), count=commit_count
            )
