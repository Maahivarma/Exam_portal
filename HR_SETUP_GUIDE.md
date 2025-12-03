# HR AI Question Generator - Setup Guide

## Overview
This feature allows HR personnel to:
1. Login to a dedicated HR dashboard
2. Select a programming topic (Python, Java, etc.)
3. Generate 50 AI-powered questions automatically
4. Review and select 20 questions
5. Create a test that will be available to users

## Backend Setup

### 1. Install Required Dependencies

```bash
cd backend
pip install openai  # For AI question generation (optional - falls back to mock questions if not installed)
```

### 2. Set OpenAI API Key (Optional)

If you want to use real AI-generated questions, set your OpenAI API key:

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="your-api-key-here"
```

**Or create a `.env` file in the backend directory:**
```
OPENAI_API_KEY=your-api-key-here
```

**Note:** If no API key is set, the system will use mock questions for development/testing.

### 3. Create Database Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Create HR User

#### Option A: Using Django Admin
1. Create a superuser (if not already created):
```bash
python manage.py createsuperuser
```

2. Start the server:
```bash
python manage.py runserver
```

3. Go to `http://localhost:8000/admin/`
4. Login with superuser credentials
5. Create a regular User:
   - Go to "Users" → "Add user"
   - Enter username and password
   - Save
6. Create HR Profile:
   - Go to "HR users" → "Add HR user"
   - Select the user you just created
   - Check "Is HR" checkbox
   - Save

#### Option B: Using Django Shell
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from assessment.models import HRUser

# Create user
user = User.objects.create_user(
    username='hr_user',
    password='hr_password123',
    email='hr@example.com'
)

# Create HR profile
hr_user = HRUser.objects.create(user=user, is_hr=True)
print(f"HR user created: {user.username}")
```

### 5. Test the Backend

Start the Django server:
```bash
python manage.py runserver
```

Test the HR login endpoint:
```bash
curl -X POST http://localhost:8000/api/hr/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "hr_user", "password": "hr_password123"}'
```

## Frontend Setup

The HR Dashboard is already integrated. Just navigate to:
```
http://localhost:5173/hr-dashboard
```

## Usage Flow

### For HR Personnel:

1. **Login**
   - Go to `/hr-dashboard`
   - Enter HR username and password
   - Click "Login"

2. **Generate Questions**
   - Select a topic (Python, Java, JavaScript, etc.)
   - Select difficulty level (Easy, Medium, Hard)
   - Click "Generate 50 Questions"
   - Wait for AI to generate questions (takes 10-30 seconds)

3. **Review Questions**
   - Scroll through generated questions
   - Each question shows:
     - Type (MCQ or Subjective)
     - Difficulty level
     - Question text
     - Options (for MCQ) or Answer (for Subjective)

4. **Select Questions**
   - Click on questions to select them (up to 20)
   - Selected questions are highlighted in purple
   - You can deselect by clicking again

5. **Create Test**
   - Select a company from dropdown
   - Enter test title (e.g., "Python Developer Assessment")
   - Set duration in minutes
   - Click "Create Test with X Questions"
   - Test will be immediately available to users

## API Endpoints

### HR Login
```
POST /api/hr/login/
Body: {"username": "hr_user", "password": "password"}
```

### Generate Questions
```
POST /api/hr/generate-questions/
Body: {
  "topic": "Python",
  "count": 50,
  "difficulty": "medium",
  "user_id": 1
}
```

### Get Generated Questions
```
GET /api/hr/generated-questions/?topic=Python&user_id=1
```

### Select Questions for Test
```
POST /api/hr/select-questions/
Body: {
  "question_ids": [1, 2, 3, ...],
  "company_id": "tcs",
  "test_title": "Python Assessment",
  "test_duration": 30
}
```

### Delete Generated Questions
```
DELETE /api/hr/delete-questions/
Body: {"question_ids": [1, 2, 3]}
```

## Troubleshooting

### Questions not generating?
- Check if OpenAI API key is set (if using real AI)
- Check browser console for errors
- Check Django server logs
- System will fall back to mock questions if OpenAI is unavailable

### Can't login as HR?
- Verify HR user exists in database
- Check HRUser profile is linked to the user
- Verify username and password are correct

### Test not appearing for users?
- Check that company exists
- Verify questions were selected (1-20 questions)
- Check Django admin to see if test was created

## Security Notes

- HR authentication is basic - consider adding JWT tokens for production
- Add rate limiting for question generation
- Add permission checks to ensure only HR can access these endpoints
- Consider adding audit logs for question generation

## Future Enhancements

- Bulk question import/export
- Question templates
- Question difficulty analysis
- Question bank management
- Test scheduling
- Analytics on generated questions

