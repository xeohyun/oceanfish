from django.urls import path
from .views.github import GitHubContributionAPI
from .views.sunfish import SunfishAPI
from .views.contribution import ContributionAPI

urlpatterns = [
    path('github/<str:username>/', GitHubContributionAPI.as_view(), name='github_contributions'),
    path('sunfish/', SunfishAPI.as_view(), name='sunfish_data'),
    path('contributions/', ContributionAPI.as_view(), name='contribution_data'),
]
