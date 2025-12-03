from django.db import models
from django.contrib.auth.models import User
import uuid


class Company(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Test(models.Model):
    company = models.ForeignKey(Company, related_name="tests", on_delete=models.CASCADE)
    test_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    duration = models.IntegerField(default=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    test = models.ForeignKey(Test, related_name="questions", on_delete=models.CASCADE)
    qid = models.CharField(max_length=100)
    text = models.TextField()
    type = models.CharField(max_length=20, choices=[("mcq", "MCQ"), ("subjective", "Subjective")])

    def __str__(self):
        return self.text[:50]


class Option(models.Model):
    question = models.ForeignKey(Question, related_name="options", on_delete=models.CASCADE)
    option_id = models.CharField(max_length=100)
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text[:40]


class Session(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    started = models.DateTimeField(auto_now_add=True)
    ended = models.DateTimeField(null=True, blank=True)
    score_mcq = models.FloatField(null=True)
    score_subjective = models.JSONField(default=dict)

    def __str__(self):
        return str(self.session_id)


class Snapshot(models.Model):
    session = models.ForeignKey(Session, related_name="snaps", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="snaps/")
    created_at = models.DateTimeField(auto_now_add=True)


class ProctorEvent(models.Model):
    session = models.ForeignKey(Session, related_name="events", on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)


class HRUser(models.Model):
    """HR User model for managing question generation"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hr_profile')
    is_hr = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"HR: {self.user.username}"


class GeneratedQuestion(models.Model):
    """Temporary storage for AI-generated questions before HR selection"""
    topic = models.CharField(max_length=100)  # Python, Java, etc.
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=[("mcq", "MCQ"), ("subjective", "Subjective")])
    options = models.JSONField(default=list)  # For MCQ: [{"text": "...", "is_correct": true/false}, ...]
    correct_answer = models.TextField(blank=True)  # For subjective questions
    difficulty = models.CharField(max_length=20, choices=[("easy", "Easy"), ("medium", "Medium"), ("hard", "Hard")], default="medium")
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    is_selected = models.BooleanField(default=False)
    selected_for_test = models.ForeignKey(Test, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.topic} - {self.question_text[:50]}"