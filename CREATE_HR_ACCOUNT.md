# How to Create HR Account - Step by Step Guide

## Method 1: Using Django Shell (Easiest)

### Step 1: Open Terminal/Command Prompt
Navigate to your project's `backend` directory:
```bash
cd backend
```

### Step 2: Activate Virtual Environment (if you're using one)
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### Step 3: Open Django Shell
```bash
python manage.py shell
```

### Step 4: Run These Commands in the Shell

Copy and paste these commands one by one:

```python
from django.contrib.auth.models import User
from assessment.models import HRUser

# Create the user (change username, password, and email as needed)
user = User.objects.create_user(
    username='hr_admin',
    password='your_secure_password_123',
    email='hr@example.com'
)

# Create HR profile
hr_user = HRUser.objects.create(user=user, is_hr=True)

# Verify it worked
print(f"✓ HR User created successfully!")
print(f"Username: {user.username}")
print(f"Email: {user.email}")
```

### Step 5: Exit the Shell
```python
exit()
```

### Step 6: Test Login
1. Start your frontend: `npm run dev` (if not already running)
2. Go to: `http://localhost:5173/hr-dashboard`
3. Login with the username and password you just created

---

## Method 2: Using Django Admin Panel

### Step 1: Create a Superuser (if you don't have one)
```bash
cd backend
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

### Step 2: Start Django Server
```bash
python manage.py runserver
```

### Step 3: Access Admin Panel
1. Open browser: `http://localhost:8000/admin/`
2. Login with your superuser credentials

### Step 4: Create Regular User
1. Click on **"Users"** under "AUTHENTICATION AND AUTHORIZATION"
2. Click **"Add user"** button (top right)
3. Enter:
   - **Username**: e.g., `hr_admin`
   - **Password**: Enter a secure password
   - **Password confirmation**: Re-enter the password
4. Click **"Save"**

### Step 5: Create HR Profile
1. After saving the user, you'll see the user detail page
2. Scroll down or look for **"HR users"** section
3. Click **"Add HR user"** or **"Add another HR user"**
4. In the form:
   - **User**: Select the user you just created from dropdown
   - **Is HR**: Check this checkbox ✓
5. Click **"Save"**

### Step 6: Test Login
1. Go to: `http://localhost:5173/hr-dashboard`
2. Login with the username and password you created

---

## Quick Example Commands

Here's a complete example you can copy-paste into Django shell:

```python
from django.contrib.auth.models import User
from assessment.models import HRUser

# Create HR user
user = User.objects.create_user(
    username='hr_user',
    password='hr123456',
    email='hr@company.com'
)

# Make them HR
HRUser.objects.create(user=user, is_hr=True)

print("HR account created! Username: hr_user, Password: hr123456")
```

---

## Troubleshooting

### "User already exists" error?
If the username already exists, you can just add HR status:
```python
from django.contrib.auth.models import User
from assessment.models import HRUser

user = User.objects.get(username='existing_username')
if not HRUser.objects.filter(user=user).exists():
    HRUser.objects.create(user=user, is_hr=True)
    print("HR status added to existing user!")
else:
    print("User is already an HR!")
```

### "Module not found" error?
Make sure you're in the `backend` directory and have activated your virtual environment.

### Can't login?
- Double-check username and password
- Make sure HRUser profile exists (check in Django admin)
- Verify the user is active (in Django admin, check "Active" checkbox)

---

## Verify HR Account Was Created

Run this in Django shell to check:
```python
from assessment.models import HRUser

hr_users = HRUser.objects.all()
for hr in hr_users:
    print(f"HR User: {hr.user.username} (Email: {hr.user.email})")
```

If you see your user listed, you're all set! 🎉

