from django.urls import path

from .views import GitHubContributionAPI
from .views.SunfishLevelUp import SunfishLevelUpView
from .views.create_fish import CreateFishAPI
from .views.sunfish import SunfishAPI
from .views.contribution import ContributionAPI
from .views.SyncSunfishStatus import SyncSunfishStatus

urlpatterns = [
    path('github/<str:username>/', GitHubContributionAPI().as_view(), name='github_contributions'),
    path('sunfish/', SunfishAPI.as_view(), name='sunfish_data'),
    path('contributions/', ContributionAPI.as_view(), name='contribution_data'),
    path('createsunfish/', CreateFishAPI.as_view(), name='create_sunfish'),
    path('sunfish/status/', SunfishAPI.as_view(), name='sunfish-status-api'),
    path('sunfish/create/', CreateFishAPI.as_view(), name='create_sunfish'),
    path('contributions/<int:sunfish_id>/', ContributionAPI.as_view(), name='contribution-detail'),
    path('sunfish/<int:sunfish_id>/level-up/', SunfishLevelUpView.as_view(), name='sunfish-level-up'),
    path('sunfish/level-up/', SunfishLevelUpView.as_view(), name='level-up-api'),
    path('sunfish/sync-status/', SyncSunfishStatus.as_view(), name='sync_sunfish_status'),
]
