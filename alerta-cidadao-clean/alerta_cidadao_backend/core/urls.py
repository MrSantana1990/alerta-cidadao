from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CampaignViewSet, ContactViewSet, MessageTemplateViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'campaigns', CampaignViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'message-templates', MessageTemplateViewSet, basename='message-template')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]


