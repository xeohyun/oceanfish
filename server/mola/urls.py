from django.urls import path

from .views import GitHubContributionAPI
from .views.create_fish import CreateFishAPI
from .views.sunfish import SunfishAPI
from .views.contribution import ContributionAPI

urlpatterns = [
    path('github/<str:username>/', GitHubContributionAPI().as_view(), name='github_contributions'),
    path('sunfish/', SunfishAPI.as_view(), name='sunfish_data'),
    path('contributions/', ContributionAPI.as_view(), name='contribution_data'),
    path('contributions/<int:sunfish_id>/', ContributionAPI.as_view(), name='contributions-api'),
    path('createsunfish/', CreateFishAPI.as_view(), name='create_sunfish'),
    path('sunfish/status/', SunfishAPI.as_view(), name='sunfish-status-api'),
    path('sunfish/create/', CreateFishAPI.as_view(), name='create_sunfish'),
]