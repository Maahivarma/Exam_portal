"""
Quick script to create HR user
Run this from the backend directory: python create_hr_user.py
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_backend.settings')
django.setup()

from django.contrib.auth.models import User
from assessment.models import HRUser

def create_hr_user():
    print("=" * 50)
    print("HR User Creation Script")
    print("=" * 50)
    
    # Get user input
    username = input("Enter username for HR: ").strip()
    if not username:
        print("Username cannot be empty!")
        return
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists!")
        choice = input("Do you want to make this user an HR? (y/n): ").strip().lower()
        if choice == 'y':
            user = User.objects.get(username=username)
            if HRUser.objects.filter(user=user).exists():
                print(f"User '{username}' is already an HR user!")
                return
            else:
                HRUser.objects.create(user=user, is_hr=True)
                print(f"✓ Successfully made '{username}' an HR user!")
                return
        else:
            return
    
    password = input("Enter password: ").strip()
    if not password:
        print("Password cannot be empty!")
        return
    
    email = input("Enter email (optional, press Enter to skip): ").strip()
    
    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email if email else f"{username}@example.com"
        )
        
        # Create HR profile
        hr_user = HRUser.objects.create(user=user, is_hr=True)
        
        print("\n" + "=" * 50)
        print("✓ HR User Created Successfully!")
        print("=" * 50)
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"HR Status: Active")
        print("\nYou can now login at: http://localhost:5173/hr-dashboard")
        print("=" * 50)
        
    except Exception as e:
        print(f"Error creating user: {e}")

if __name__ == "__main__":
    create_hr_user()

