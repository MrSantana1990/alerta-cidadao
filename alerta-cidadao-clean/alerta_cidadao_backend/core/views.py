import json
from datetime import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views import View
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from .models import Campaign, Contact, ReferralLink, Event, ReferralTree, CampaignMetrics
from django.contrib.auth.models import User
from .utils.token_utils import ReferralTokenManager, ConsentHasher, PhoneNumberUtils, ReferralTreeBuilder

# Initialize token manager
token_manager = ReferralTokenManager()

# Simplified ViewSets for basic CRUD operations
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        
        class UserSerializer(serializers.ModelSerializer):
            class Meta:
                model = User
                fields = ["id", "username", "email", "first_name", "last_name"]
        
        return UserSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        
        class CampaignSerializer(serializers.ModelSerializer):
            class Meta:
                model = Campaign
                fields = "__all__"
        
        return CampaignSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        
        class ContactSerializer(serializers.ModelSerializer):
            class Meta:
                model = Contact
                fields = "__all__"
        
        return ContactSerializer

class MessageTemplateViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()  # Using Campaign as placeholder
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        
        class MessageTemplateSerializer(serializers.ModelSerializer):
            class Meta:
                model = Campaign
                fields = "__all__"
        
        return MessageTemplateSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()  # Using Campaign as placeholder
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from rest_framework import serializers
        
        class ReportSerializer(serializers.ModelSerializer):
            class Meta:
                model = Campaign
                fields = "__all__"
        
        return ReportSerializer


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip

def get_user_agent(request):
    """Get user agent from request"""
    return request.META.get("HTTP_USER_AGENT", "")

@require_http_methods(["GET"])
def referral_redirect(request, token):
    """
    Handle referral link clicks
    Validates token, logs click event, and redirects to landing page
    """
    # Validate token
    payload = token_manager.validate_token(token)
    if not payload:
        return render(request, "error.html", {
            "error_message": "Link inválido ou expirado.",
            "error_code": "INVALID_TOKEN"
        })
    
    campaign_id = payload.get("campaign_id")
    contact_id = payload.get("contact_id")
    referrer_contact_id = payload.get("referrer_contact_id")
    
    # Get campaign
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return render(request, "error.html", {
            "error_message": "Campanha não encontrada.",
            "error_code": "CAMPAIGN_NOT_FOUND"
        })
    
    # Get contact (link owner)
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return render(request, "error.html", {
            "error_message": "Contato não encontrado.",
            "error_code": "CONTACT_NOT_FOUND"
        })
    
    # Get referrer contact if exists
    referrer_contact = None
    if referrer_contact_id:
        try:
            referrer_contact = Contact.objects.get(id=referrer_contact_id)
        except Contact.DoesNotExist:
            pass
    
    # Get or create referral link
    referral_link, created = ReferralLink.objects.get_or_create(
        campaign=campaign,
        contact=contact,
        defaults={
            "signed_token": token
        }
    )
    
    # Log click event
    Event.objects.create(
        campaign=campaign,
        contact=None,  # Visitor hasn't opted in yet
        referrer_contact=referrer_contact,
        referral_link=referral_link,
        type="click",
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        metadata={
            "token_payload": payload,
            "referral_link_id": referral_link.id,
        }
    )
    
    # Update click count
    referral_link.clicks_count += 1
    referral_link.save()
    
    # Redirect to landing page
    return redirect(f"/c/{campaign.slug}?t={token}")

@require_http_methods(["GET"])
def campaign_landing(request, slug):
    """
    Render the LGPD landing page for a campaign
    """
    campaign = get_object_or_404(Campaign, slug=slug)
    token = request.GET.get("t")
    
    # Validate token if provided
    payload = None
    if token:
        payload = token_manager.validate_token(token)
    
    context = {
        "campaign": campaign,
        "token": token,
        "payload": payload,
        "consent_text": get_consent_text(),
        "privacy_policy_url": getattr(settings, "PRIVACY_POLICY_URL", "/privacy"),
    }
    
    return render(request, "campaign_landing.html", context)

@api_view(["POST"])
@permission_classes([AllowAny])
def api_optin(request):
    """
    Handle opt-in form submission
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response({
            "error": "Invalid JSON data"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate required fields
    phone = data.get("phone", "").strip()
    consent = data.get("consent", False)
    token = data.get("token", "").strip()
    name = data.get("name", "").strip()
    
    if not phone:
        return Response({
            "error": "Número de telefone é obrigatório"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not consent:
        return Response({
            "error": "Consentimento é obrigatório"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not token:
        return Response({
            "error": "Token é obrigatório"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate token
    payload = token_manager.validate_token(token)
    if not payload:
        return Response({
            "error": "Token inválido ou expirado"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Normalize phone number
    normalized_phone = PhoneNumberUtils.normalize_phone(phone)
    if not normalized_phone:
        return Response({
            "error": "Número de telefone inválido"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Get campaign and referrer
    campaign_id = payload.get("campaign_id")
    referrer_contact_id = payload.get("referrer_contact_id")
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            "error": "Campanha não encontrada"
        }, status=status.HTTP_404_NOT_FOUND)
    
    referrer_contact = None
    if referrer_contact_id:
        try:
            referrer_contact = Contact.objects.get(id=referrer_contact_id)
        except Contact.DoesNotExist:
            pass
    
    # Get client info
    client_ip = get_client_ip(request)
    user_agent = get_user_agent(request)
    consent_text = get_consent_text()
    consent_hash = ConsentHasher.hash_consent_text(consent_text)
    
    with transaction.atomic():
        # Create or update contact
        contact, contact_created = Contact.objects.get_or_create(
            phone=normalized_phone,
            defaults={
                "name": name,
                "status": "active",
                "consent_given_at": timezone.now(),
                "consent_ip": client_ip,
                "consent_text_hash": consent_hash,
            }
        )
        
        if not contact_created:
            # Update existing contact
            if name and not contact.name:
                contact.name = name
            contact.status = "active"
            contact.consent_given_at = timezone.now()
            contact.consent_ip = client_ip
            contact.consent_text_hash = consent_hash
            contact.save()
        
        # Add to referral tree
        tree_node = ReferralTreeBuilder.add_to_tree(
            campaign=campaign,
            contact=contact,
            referrer_contact=referrer_contact
        )
        
        # Create referral link for new contact
        new_token = token_manager.generate_token(
            campaign_id=campaign.id,
            contact_id=contact.id,
            referrer_contact_id=contact.id  # Self-referencing for new links
        )
        
        new_referral_link, link_created = ReferralLink.objects.get_or_create(
            campaign=campaign,
            contact=contact,
            defaults={
                "signed_token": new_token
            }
        )
        
        # Log opt-in event
        Event.objects.create(
            campaign=campaign,
            contact=contact,
            referrer_contact=referrer_contact,
            referral_link=new_referral_link,
            type="optin",
            ip_address=client_ip,
            user_agent=user_agent,
            metadata={
                "original_token": token,
                "consent_hash": consent_hash,
                "tree_level": tree_node.level,
            }
        )
        
        # Update referrer's referral count if exists
        if referrer_contact:
            referrer_link = ReferralLink.objects.filter(
                campaign=campaign,
                contact=referrer_contact
            ).first()
            if referrer_link:
                referrer_link.referrals_count += 1
                referrer_link.save()
    
    # Generate WhatsApp share URL
    share_text = f"Veja isso: {new_referral_link.referral_url}"
    whatsapp_url = f"https://wa.me/?text={share_text}"
    
    return Response({
        "success": True,
        "message": "Cadastro realizado com sucesso!",
        "data": {
            "contact_id": contact.id,
            "referral_url": new_referral_link.referral_url,
            "whatsapp_share_url": whatsapp_url,
            "tree_level": tree_node.level,
        }
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def api_share(request):
    """
    Log share events (optional endpoint for tracking share intentions)
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response({
            "error": "Invalid JSON data"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    token = data.get("token", "").strip()
    share_method = data.get("method", "whatsapp")  # whatsapp, copy, etc.
    
    if not token:
        return Response({
            "error": "Token é obrigatório"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate token
    payload = token_manager.validate_token(token)
    if not payload:
        return Response({
            "error": "Token inválido ou expirado"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    campaign_id = payload.get("campaign_id")
    contact_id = payload.get("contact_id")
    
    try:
        campaign = Campaign.objects.get(id=campaign_id)
        contact = Contact.objects.get(id=contact_id)
    except (Campaign.DoesNotExist, Contact.DoesNotExist):
        return Response({
            "error": "Campanha ou contato não encontrado"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get referral link
    referral_link = ReferralLink.objects.filter(
        campaign=campaign,
        contact=contact
    ).first()
    
    # Log share event
    Event.objects.create(
        campaign=campaign,
        contact=contact,
        referral_link=referral_link,
        type="share",
        ip_address=get_client_ip(request),
        user_agent=get_user_agent(request),
        metadata={
            "share_method": share_method,
            "token": token,
        }
    )
    
    return Response({
        "success": True,
        "message": "Compartilhamento registrado"
    })

@api_view(["POST"])
@permission_classes([AllowAny])
def api_optout(request):
    """
    Handle opt-out requests
    """
    phone = request.GET.get("phone", "").strip()
    
    if not phone:
        return Response({
            "error": "Número de telefone é obrigatório"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    normalized_phone = PhoneNumberUtils.normalize_phone(phone)
    if not normalized_phone:
        return Response({
            "error": "Número de telefone inválido"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        contact = Contact.objects.get(phone=normalized_phone)
        contact.status = "optout"
        contact.save()
        
        # Log opt-out event for all campaigns
        campaigns = Campaign.objects.filter(
            referral_links__contact=contact
        ).distinct()
        
        for campaign in campaigns:
            Event.objects.create(
                campaign=campaign,
                contact=contact,
                type="optout",
                ip_address=get_client_ip(request),
                user_agent=get_user_agent(request),
                metadata={
                    "optout_method": "web",
                }
            )
        
        return Response({
            "success": True,
            "message": "Opt-out realizado com sucesso"
        })
        
    except Contact.DoesNotExist:
        return Response({
            "error": "Contato não encontrado"
        }, status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(["GET"])
def api_campaign_metrics(request, campaign_id):
    """
    Get metrics for a specific campaign
    """
    try:
        campaign = Campaign.objects.get(id=campaign_id)
    except Campaign.DoesNotExist:
        return Response({
            "error": "Campanha não encontrada"
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get or create metrics
    metrics, created = CampaignMetrics.objects.get_or_create(
        campaign=campaign
    )
    
    if created or (timezone.now() - metrics.last_updated).seconds > 300:  # Update every 5 minutes
        metrics.update_metrics()
    
    # Get top referrers
    top_referrers = ReferralTreeBuilder.get_top_referrers(campaign, limit=10)
    
    # Get tree stats
    tree_stats = ReferralTreeBuilder.get_tree_stats(campaign)
    
    # Get recent events
    recent_events = Event.objects.filter(
        campaign=campaign
    ).select_related("contact", "referrer_contact").order_by("-timestamp")[:20]
    
    events_data = []
    for event in recent_events:
        events_data.append({
            "id": event.id,
            "type": event.type,
            "timestamp": event.timestamp.isoformat(),
            "contact_phone": PhoneNumberUtils.format_phone_display(event.contact.phone) if event.contact else None,
            "referrer_phone": PhoneNumberUtils.format_phone_display(event.referrer_contact.phone) if event.referrer_contact else None,
            "ip_address": event.ip_address,
        })
    
    return Response({
        "campaign": {
            "id": campaign.id,
            "title": campaign.title,
            "slug": campaign.slug,
            "status": campaign.status,
        },
        "metrics": {
            "total_links_generated": metrics.total_links_generated,
            "total_clicks": metrics.total_clicks,
            "unique_clicks": metrics.unique_clicks,
            "total_optins": metrics.total_optins,
            "total_shares": metrics.total_shares,
            "total_referrals": metrics.total_referrals,
            "max_tree_depth": metrics.max_tree_depth,
            "avg_tree_depth": round(metrics.avg_tree_depth, 2),
            "click_to_optin_rate": round(metrics.click_to_optin_rate, 2),
            "referral_rate": round(metrics.referral_rate, 2),
            "last_updated": metrics.last_updated.isoformat(),
        },
        "top_referrers": top_referrers,
        "tree_stats": tree_stats,
        "recent_events": events_data,
    })

def get_consent_text():
    """
    Get the standard consent text for LGPD compliance
    """
    return """
    Ao fornecer seu número de telefone, você autoriza a Prefeitura Municipal de Campinas 
    a utilizá-lo para envio de alertas oficiais, informações de utilidade pública e 
    comunicações relacionadas aos serviços municipais. Seus dados serão tratados conforme 
    nossa Política de Privacidade e você pode revogar este consentimento a qualquer momento 
    enviando SAIR para este número ou acessando nosso portal de opt-out.
    """.strip()

# Error handlers
def handler404(request, exception):
    return render(request, "error.html", {
        "error_message": "Página não encontrada.",
        "error_code": "404"
    }, status=404)

def handler500(request):
    return render(request, "error.html", {
        "error_message": "Erro interno do servidor.",
        "error_code": "500"
    }, status=500)


# --- stub de rota de opt-out (usado nas URLs do projeto) ---
def optout_page(request):
    # Página simples só para existir; o opt-out real é no POST /api/optout/
    from django.http import JsonResponse
    return JsonResponse({"message": "Página de Opt-out"})



