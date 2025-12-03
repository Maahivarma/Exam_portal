"""
Script to verify and fix HR admin user
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_backend.settings')
django.setup()

from django.contrib.auth.models import User
from assessment.models import HRUser

# Get the user
try:
    user = User.objects.get(username='hr_admin')
    print(f"✓ User found: {user.username}")
    
    # Ensure user is active
    user.is_active = True
    user.is_staff = False
    user.is_superuser = False
    user.set_password('hr_admin@123')
    user.save()
    print(f"✓ Password reset and user activated")
    
    # Get or create HR profile
    hr_user, created = HRUser.objects.get_or_create(
        user=user,
        defaults={'is_hr': True}
    )
    hr_user.is_hr = True
    hr_user.save()
    
    print(f"✓ HR profile exists: {hr_user.is_hr}")
    
    # Test authentication
    from django.contrib.auth import authenticate
    auth_user = authenticate(username='hr_admin', password='hr_admin@123')
    if auth_user:
        print(f"✓ Authentication test: SUCCESS")
    else:
        print(f"✗ Authentication test: FAILED")
    
    print("\n" + "=" * 60)
    print("Account Details:")
    print("=" * 60)
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Is Active: {user.is_active}")
    print(f"Is HR: {hr_user.is_hr}")
    print(f"HR Profile ID: {hr_user.id}")
    print("=" * 60)
    
except User.DoesNotExist:
    print("✗ User 'hr_admin' not found!")
    print("Creating new user...")
    
    user = User.objects.create_user(
        username='hr_admin',
        password='hr_admin@123',
        email='hr_admin@example.com',
        is_active=True
    )
    
    hr_user = HRUser.objects.create(user=user, is_hr=True)
    
    print("✓ User and HR profile created!")

