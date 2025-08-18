from rest_framework import serializers
from .models import User, Campaign, Contact, MessageTemplate, Report

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "address",
        )


class CampaignSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.username")

    class Meta:
        model = Campaign
        fields = (
            "id",
            "title",
            "category",
            "message",
            "scheduled_at",
            "created_at",
            "updated_at",
            "created_by",
        )


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ("id", "name", "phone_number", "bairro", "tag", "is_optout")


class MessageTemplateSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.username")

    class Meta:
        model = MessageTemplate
        fields = ("id", "name", "content", "category", "created_by", "created_at")


class ReportSerializer(serializers.ModelSerializer):
    campaign_title = serializers.ReadOnlyField(source="campaign.title")

    class Meta:
        model = Report
        fields = (
            "id",
            "campaign_title",
            "total_sent",
            "total_delivered",
            "total_read",
            "total_pending",
            "total_optout",
            "generated_at",
        )


