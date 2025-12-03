"""
Script to create HR admin user
Run: python create_hr_admin.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_backend.settings')
django.setup()

from django.contrib.auth.models import User
from assessment.models import HRUser

# Create or get user
user, created = User.objects.get_or_create(
    username='hr_admin',
    defaults={
        'email': 'hr_admin@example.com'
    }
)

# Set password
user.set_password('hr_admin@123')
user.save()

# Create or get HR profile
hr_user, hr_created = HRUser.objects.get_or_create(
    user=user,
    defaults={'is_hr': True}
)

# Ensure is_hr is True
hr_user.is_hr = True
hr_user.save()

print("=" * 60)
print("HR Admin User Created Successfully!")
print("=" * 60)
print(f"Username: {user.username}")
print(f"Password: hr_admin@123")
print(f"Email: {user.email}")
print(f"User was created: {created}")
print(f"HR profile was created: {hr_created}")
print(f"Is HR: {hr_user.is_hr}")
print("=" * 60)
print("\nYou can now login at: http://localhost:5173/hr-dashboard")
print("=" * 60)

