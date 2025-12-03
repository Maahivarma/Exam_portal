"""
Script to create companies if they don't exist
Run: python create_companies.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_backend.settings')
django.setup()

from assessment.models import Company

companies_data = [
    {"id": "tcs", "name": "TCS"},
    {"id": "google", "name": "Google"},
    {"id": "microsoft", "name": "Microsoft"},
    {"id": "amazon", "name": "Amazon"},
    {"id": "wipro", "name": "Wipro"},
    {"id": "infosys", "name": "Infosys"},
    {"id": "facebook", "name": "Meta"},
    {"id": "apple", "name": "Apple"},
    {"id": "oracle", "name": "Oracle"},
    {"id": "ibm", "name": "IBM"},
]

created_count = 0
for company_data in companies_data:
    company, created = Company.objects.get_or_create(
        id=company_data["id"],
        defaults={"name": company_data["name"]}
    )
    if created:
        created_count += 1
        print(f"✓ Created: {company.name}")

print(f"\n{'='*60}")
print(f"Total companies: {Company.objects.count()}")
print(f"Newly created: {created_count}")
print(f"{'='*60}")

