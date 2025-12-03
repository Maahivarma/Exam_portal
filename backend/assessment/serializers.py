from rest_framework import serializers
from .models import Company, Test, Question, Option, Session, Snapshot, ProctorEvent


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["option_id", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["qid", "text", "type", "options"]


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ["test_id", "title", "duration", "description", "questions"]


class CompanySerializer(serializers.ModelSerializer):
    tests = TestSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = ["id", "name", "tests"]


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = "__all__"
