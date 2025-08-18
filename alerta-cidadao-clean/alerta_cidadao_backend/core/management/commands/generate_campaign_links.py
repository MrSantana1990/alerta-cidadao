import csv
import os
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify
from ...models import Campaign, Contact, ReferralLink, ReferralTree
from alerta_cidadao_backend.utils.token_utils import ReferralTokenManager, PhoneNumberUtils, ReferralTreeBuilder

class Command(BaseCommand):
    help = 'Generate referral links for a campaign from CSV file'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--campaign',
            type=int,
            required=True,
            help='Campaign ID to generate links for'
        )
        parser.add_argument(
            '--csv-file',
            type=str,
            required=True,
            help='Path to CSV file with contacts'
        )
        parser.add_argument(
            '--phone-column',
            type=str,
            default='phone',
            help='Name of the phone column in CSV (default: phone)'
        )
        parser.add_argument(
            '--name-column',
            type=str,
            default='name',
            help='Name of the name column in CSV (default: name)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually doing it'
        )
        parser.add_argument(
            '--output-file',
            type=str,
            help='Output CSV file with generated links'
        )
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip contacts that already have links for this campaign'
        )
    
    def handle(self, *args, **options):
        campaign_id = options['campaign']
        csv_file = options['csv_file']
        phone_column = options['phone_column']
        name_column = options['name_column']
        dry_run = options['dry_run']
        output_file = options['output_file']
        skip_existing = options['skip_existing']
        
        # Validate campaign
        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            raise CommandError(f'Campaign with ID {campaign_id} does not exist')
        
        # Validate CSV file
        if not os.path.exists(csv_file):
            raise CommandError(f'CSV file {csv_file} does not exist')
        
        self.stdout.write(f'Processing campaign: {campaign.title}')
        self.stdout.write(f'Reading CSV file: {csv_file}')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))
        
        # Initialize token manager
        token_manager = ReferralTokenManager()
        
        # Statistics
        stats = {
            'total_rows': 0,
            'valid_phones': 0,
            'invalid_phones': 0,
            'existing_contacts': 0,
            'new_contacts': 0,
            'existing_links': 0,
            'new_links': 0,
            'errors': 0,
        }
        
        # Store results for output file
        results = []
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                # Detect delimiter
                sample = file.read(1024)
                file.seek(0)
                sniffer = csv.Sniffer()
                delimiter = sniffer.sniff(sample).delimiter
                
                reader = csv.DictReader(file, delimiter=delimiter)
                
                # Validate columns
                if phone_column not in reader.fieldnames:
                    raise CommandError(f'Phone column "{phone_column}" not found in CSV. Available columns: {reader.fieldnames}')
                
                with transaction.atomic():
                    for row_num, row in enumerate(reader, 1):
                        stats['total_rows'] += 1
                        
                        # Get phone and name
                        phone = row.get(phone_column, '').strip()
                        name = row.get(name_column, '').strip()
                        
                        if not phone:
                            self.stdout.write(
                                self.style.WARNING(f'Row {row_num}: Empty phone number, skipping')
                            )
                            stats['errors'] += 1
                            continue
                        
                        # Normalize phone
                        normalized_phone = PhoneNumberUtils.normalize_phone(phone)
                        if not normalized_phone:
                            self.stdout.write(
                                self.style.ERROR(f'Row {row_num}: Invalid phone number "{phone}", skipping')
                            )
                            stats['invalid_phones'] += 1
                            continue
                        
                        stats['valid_phones'] += 1
                        
                        try:
                            if not dry_run:
                                # Create or get contact
                                contact, contact_created = Contact.objects.get_or_create(
                                    phone=normalized_phone,
                                    defaults={
                                        'name': name,
                                        'status': 'active',
                                    }
                                )
                                
                                if contact_created:
                                    stats['new_contacts'] += 1
                                    self.stdout.write(f'Row {row_num}: Created new contact {normalized_phone}')
                                else:
                                    stats['existing_contacts'] += 1
                                    # Update name if empty and we have a name
                                    if name and not contact.name:
                                        contact.name = name
                                        contact.save()
                                
                                # Check if link already exists
                                existing_link = ReferralLink.objects.filter(
                                    campaign=campaign,
                                    contact=contact
                                ).first()
                                
                                if existing_link:
                                    if skip_existing:
                                        stats['existing_links'] += 1
                                        referral_url = existing_link.referral_url
                                        self.stdout.write(f'Row {row_num}: Using existing link for {normalized_phone}')
                                    else:
                                        # Update existing link with new token
                                        new_token = token_manager.generate_token(
                                            campaign_id=campaign.id,
                                            contact_id=contact.id
                                        )
                                        existing_link.signed_token = new_token
                                        existing_link.save()
                                        referral_url = existing_link.referral_url
                                        stats['existing_links'] += 1
                                        self.stdout.write(f'Row {row_num}: Updated existing link for {normalized_phone}')
                                else:
                                    # Create new referral link
                                    new_token = token_manager.generate_token(
                                        campaign_id=campaign.id,
                                        contact_id=contact.id
                                    )
                                    
                                    referral_link = ReferralLink.objects.create(
                                        campaign=campaign,
                                        contact=contact,
                                        signed_token=new_token
                                    )
                                    
                                    # Add to referral tree as root node
                                    ReferralTreeBuilder.add_to_tree(
                                        campaign=campaign,
                                        contact=contact,
                                        referrer_contact=None
                                    )
                                    
                                    referral_url = referral_link.referral_url
                                    stats['new_links'] += 1
                                    self.stdout.write(f'Row {row_num}: Created new link for {normalized_phone}')
                            
                            else:
                                # Dry run - just simulate
                                referral_url = f"https://example.com/r/TOKEN_FOR_{normalized_phone}"
                                self.stdout.write(f'Row {row_num}: Would process {normalized_phone} ({name})')
                            
                            # Store result
                            result = {
                                'original_phone': phone,
                                'normalized_phone': normalized_phone,
                                'name': name,
                                'referral_url': referral_url,
                                'whatsapp_message': f"Veja isso: {referral_url}",
                                'row_number': row_num,
                            }
                            results.append(result)
                            
                        except Exception as e:
                            self.stdout.write(
                                self.style.ERROR(f'Row {row_num}: Error processing {phone}: {str(e)}')
                            )
                            stats['errors'] += 1
                            continue
                    
                    if dry_run:
                        # Rollback transaction in dry run
                        transaction.set_rollback(True)
        
        except Exception as e:
            raise CommandError(f'Error reading CSV file: {str(e)}')
        
        # Write output file if requested
        if output_file and results:
            try:
                with open(output_file, 'w', encoding='utf-8', newline='') as file:
                    fieldnames = [
                        'row_number',
                        'original_phone',
                        'normalized_phone', 
                        'name',
                        'referral_url',
                        'whatsapp_message'
                    ]
                    writer = csv.DictWriter(file, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(results)
                
                self.stdout.write(
                    self.style.SUCCESS(f'Results written to: {output_file}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error writing output file: {str(e)}')
                )
        
        # Print statistics
        self.stdout.write('\n' + '='*50)
        self.stdout.write('PROCESSING SUMMARY')
        self.stdout.write('='*50)
        self.stdout.write(f'Campaign: {campaign.title} (ID: {campaign.id})')
        self.stdout.write(f'Total rows processed: {stats["total_rows"]}')
        self.stdout.write(f'Valid phone numbers: {stats["valid_phones"]}')
        self.stdout.write(f'Invalid phone numbers: {stats["invalid_phones"]}')
        self.stdout.write(f'New contacts created: {stats["new_contacts"]}')
        self.stdout.write(f'Existing contacts: {stats["existing_contacts"]}')
        self.stdout.write(f'New links created: {stats["new_links"]}')
        self.stdout.write(f'Existing links: {stats["existing_links"]}')
        self.stdout.write(f'Errors: {stats["errors"]}')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('\nDRY RUN COMPLETED - No changes were made'))
        else:
            self.stdout.write(self.style.SUCCESS('\nPROCESSING COMPLETED'))
        
        # Update campaign metrics
        if not dry_run:
            try:
                from ...models import CampaignMetrics
                metrics, created = CampaignMetrics.objects.get_or_create(
                    campaign=campaign
                )
                metrics.update_metrics()
                self.stdout.write('Campaign metrics updated')
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'Warning: Could not update metrics: {str(e)}')
                )

