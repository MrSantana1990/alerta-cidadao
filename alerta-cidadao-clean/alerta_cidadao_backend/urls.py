from django.contrib import admin
from django.urls import path
from alerta_cidadao_backend.core import views as core_views

urlpatterns = [
    path("admin/", admin.site.urls),

    path("r/<str:token>/", core_views.referral_redirect, name="referral_redirect"),
    path("c/<slug:slug>/", core_views.campaign_landing, name="campaign_landing"),
    path("optout/", core_views.optout_page, name="optout_page"),

    path("api/optin/", core_views.api_optin, name="api_optin"),
    path("api/share/", core_views.api_share, name="api_share"),
    path("api/optout/", core_views.api_optout, name="api_optout"),
    path("api/campaigns/<int:campaign_id>/metrics/", core_views.api_campaign_metrics, name="api_campaign_metrics"),
]
