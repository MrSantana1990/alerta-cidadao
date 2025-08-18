import json
import hashlib
from datetime import datetime, timedelta
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.conf import settings
from django.utils import timezone

class ReferralTokenManager:
    """
    Manages the creation and validation of referral tokens
    """
    
    def __init__(self):
        self.signer = TimestampSigner(
            key=getattr(settings, 'REFERRAL_SECRET_KEY', settings.SECRET_KEY),
            salt='referral_links'
        )
    
    def generate_token(self, campaign_id, contact_id, referrer_contact_id=None, expires_days=365):
        """
        Generate a signed token for referral links
        
        Args:
            campaign_id: ID of the campaign
            contact_id: ID of the contact who owns this link
            referrer_contact_id: ID of the contact who referred (optional)
            expires_days: Token expiration in days
        
        Returns:
            str: Signed token
        """
        payload = {
            'campaign_id': campaign_id,
            'contact_id': contact_id,
            'referrer_contact_id': referrer_contact_id,
            'created_at': timezone.now().isoformat(),
        }
        
        # Convert payload to JSON string
        payload_str = json.dumps(payload, sort_keys=True)
        
        # Sign the payload
        signed_token = self.signer.sign(payload_str)
        
        return signed_token
    
    def validate_token(self, signed_token, max_age_days=365):
        """
        Validate and decode a signed token
        
        Args:
            signed_token: The signed token to validate
            max_age_days: Maximum age in days for the token
        
        Returns:
            dict: Decoded payload if valid, None if invalid
        """
        try:
            max_age_seconds = max_age_days * 24 * 60 * 60
            payload_str = self.signer.unsign(signed_token, max_age=max_age_seconds)
            payload = json.loads(payload_str)
            return payload
        except (BadSignature, SignatureExpired, json.JSONDecodeError):
            return None
    
    def is_token_valid(self, signed_token, max_age_days=365):
        """
        Check if a token is valid without decoding
        
        Args:
            signed_token: The signed token to check
            max_age_days: Maximum age in days for the token
        
        Returns:
            bool: True if valid, False otherwise
        """
        return self.validate_token(signed_token, max_age_days) is not None

class ConsentHasher:
    """
    Utility to hash consent text for LGPD compliance
    """
    
    @staticmethod
    def hash_consent_text(consent_text):
        """
        Create a hash of the consent text for LGPD record keeping
        
        Args:
            consent_text: The consent text shown to the user
        
        Returns:
            str: SHA-256 hash of the consent text
        """
        return hashlib.sha256(consent_text.encode('utf-8')).hexdigest()
    
    @staticmethod
    def verify_consent_hash(consent_text, stored_hash):
        """
        Verify if consent text matches the stored hash
        
        Args:
            consent_text: The consent text to verify
            stored_hash: The stored hash to compare against
        
        Returns:
            bool: True if matches, False otherwise
        """
        return ConsentHasher.hash_consent_text(consent_text) == stored_hash

class PhoneNumberUtils:
    """
    Utility functions for phone number handling
    """
    
    @staticmethod
    def normalize_phone(phone):
        """
        Normalize phone number to E.164 format
        
        Args:
            phone: Phone number in various formats
        
        Returns:
            str: Normalized phone number or None if invalid
        """
        import re
        
        # Remove all non-digit characters
        digits_only = re.sub(r'\D', '', phone)
        
        # Brazilian phone number handling
        if len(digits_only) == 11 and digits_only.startswith('0'):
            # Remove leading zero
            digits_only = digits_only[1:]
        
        if len(digits_only) == 10:
            # Add country code for Brazil
            digits_only = '55' + digits_only
        elif len(digits_only) == 11:
            # Add country code for Brazil (with 9th digit)
            digits_only = '55' + digits_only
        
        # Validate Brazilian format
        if len(digits_only) == 13 and digits_only.startswith('55'):
            return '+' + digits_only
        
        return None
    
    @staticmethod
    def is_valid_phone(phone):
        """
        Check if phone number is valid
        
        Args:
            phone: Phone number to validate
        
        Returns:
            bool: True if valid, False otherwise
        """
        normalized = PhoneNumberUtils.normalize_phone(phone)
        return normalized is not None
    
    @staticmethod
    def format_phone_display(phone):
        """
        Format phone number for display
        
        Args:
            phone: Phone number in E.164 format
        
        Returns:
            str: Formatted phone number
        """
        if not phone.startswith('+55'):
            return phone
        
        # Remove +55
        digits = phone[3:]
        
        if len(digits) == 11:
            # Format: (XX) 9XXXX-XXXX
            return f"({digits[:2]}) {digits[2]}{digits[3:7]}-{digits[7:]}"
        elif len(digits) == 10:
            # Format: (XX) XXXX-XXXX
            return f"({digits[:2]}) {digits[2:6]}-{digits[6:]}"
        
        return phone

class ReferralTreeBuilder:
    """
    Utility to build and maintain referral trees
    """
    
    @staticmethod
    def add_to_tree(campaign, contact, referrer_contact=None):
        """
        Add a contact to the referral tree
        
        Args:
            campaign: Campaign instance
            contact: Contact instance to add
            referrer_contact: Contact instance who referred (optional)
        
        Returns:
            ReferralTree: Created tree node
        """
        from ..models import ReferralTree
        
        if referrer_contact:
            # Find referrer's tree node
            referrer_tree = ReferralTree.objects.filter(
                campaign=campaign,
                contact=referrer_contact
            ).first()
            
            if referrer_tree:
                level = referrer_tree.level + 1
                path = f"{referrer_tree.path}/{contact.id}"
            else:
                # Referrer not in tree yet, create as root
                level = 1
                path = f"/{referrer_contact.id}/{contact.id}"
        else:
            # Root node
            level = 0
            path = f"/{contact.id}"
        
        tree_node, created = ReferralTree.objects.get_or_create(
            campaign=campaign,
            contact=contact,
            defaults={
                'referrer_contact': referrer_contact,
                'level': level,
                'path': path,
            }
        )
        
        return tree_node
    
    @staticmethod
    def get_tree_stats(campaign):
        """
        Get statistics about the referral tree
        
        Args:
            campaign: Campaign instance
        
        Returns:
            dict: Tree statistics
        """
        from django.db.models import Count, Max, Avg
        from ..models import ReferralTree
        
        trees = ReferralTree.objects.filter(campaign=campaign)
        
        if not trees.exists():
            return {
                'total_nodes': 0,
                'max_depth': 0,
                'avg_depth': 0.0,
                'root_nodes': 0,
                'leaf_nodes': 0,
            }
        
        stats = trees.aggregate(
            total_nodes=Count('id'),
            max_depth=Max('level'),
            avg_depth=Avg('level'),
        )
        
        # Count root nodes (level 0)
        root_nodes = trees.filter(level=0).count()
        
        # Count leaf nodes (nodes with no children)
        leaf_nodes = 0
        for tree in trees:
            if not tree.get_children().exists():
                leaf_nodes += 1
        
        stats.update({
            'root_nodes': root_nodes,
            'leaf_nodes': leaf_nodes,
        })
        
        return stats
    
    @staticmethod
    def get_top_referrers(campaign, limit=10):
        """
        Get top referrers for a campaign
        
        Args:
            campaign: Campaign instance
            limit: Number of top referrers to return
        
        Returns:
            list: List of contacts with referral counts
        """
        from django.db.models import Count
        from ..models import Contact, ReferralTree
        
        top_referrers = (
            Contact.objects
            .filter(referred_trees__campaign=campaign)
            .annotate(referral_count=Count('referred_trees'))
            .order_by('-referral_count')[:limit]
        )
        
        return [
            {
                'contact': referrer,
                'referral_count': referrer.referral_count,
                'phone_display': PhoneNumberUtils.format_phone_display(referrer.phone),
            }
            for referrer in top_referrers
        ]

