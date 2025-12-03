from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Company, Test, Question, Option, Session, Snapshot, ProctorEvent, HRUser, GeneratedQuestion
from .serializers import CompanySerializer, TestSerializer, SessionSerializer
from .ai_service import generate_questions
import uuid

# LIST ALL COMPANIES + TESTS
@api_view(["GET"])
def get_companies(request):
    return Response(CompanySerializer(Company.objects.all(), many=True).data)

# LIST ALL TESTS
@api_view(["GET"])
def get_all_tests(request):
    tests = Test.objects.all()
    return Response(TestSerializer(tests, many=True).data)

# GET TEST DETAILS
@api_view(["GET"])
def get_test(request, test_id):
    try:
        test = Test.objects.get(test_id=test_id)
    except:
        return Response({"error": "not found"}, status=404)
    return Response(TestSerializer(test).data)

# START SESSION
@api_view(["POST"])
def start_session(request):
    test_id = request.data.get("test_id")
    username = request.data.get("username")
    test = Test.objects.get(test_id=test_id)
    session = Session.objects.create(test=test, username=username)
    return Response({"session_id": str(session.session_id)})

# SUBMIT TEST
@api_view(["POST"])
def submit_test(request):
    session_id = request.data.get("session_id")
    answers = request.data.get("answers")  # { qid: answer }

    session = Session.objects.get(session_id=session_id)
    test = session.test

    # ---- MCQ SCORE ----
    total_mcq = 0
    correct_mcq = 0

    for q in test.questions.filter(type="mcq"):
        total_mcq += 1
        correct_opt = q.options.filter(is_correct=True).first()
        if not correct_opt:
            continue

        user_ans = answers.get(q.qid)
        if user_ans == correct_opt.option_id:
            correct_mcq += 1

    percent_mcq = round((correct_mcq / total_mcq) * 100, 2) if total_mcq else 0

    # ---- SUBJECTIVE ----
    subjective_scores = {}
    for q in test.questions.filter(type="subjective"):
        student = answers.get(q.qid, "")
        if len(student) < 3:
            subjective_scores[q.qid] = 0
        else:
            subjective_scores[q.qid] = 70  # simple default baseline (upgrade later)

    session.score_mcq = percent_mcq
    session.score_subjective = subjective_scores
    session.save()

    return Response({
        "mcq_score": percent_mcq,
        "subjective_scores": subjective_scores
    })

# RECORD PROCTORING EVENT
@api_view(["POST"])
def log_event(request):
    session_id = request.data.get("session_id")
    event_type = request.data.get("event")
    session = Session.objects.get(session_id=session_id)
    ProctorEvent.objects.create(session=session, event_type=event_type)
    return Response({"status": "ok"})

# SNAPSHOT UPLOAD
@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_snapshot(request):
    session_id = request.data.get("session_id")
    file = request.data.get("image")
    session = Session.objects.get(session_id=session_id)
    Snapshot.objects.create(session=session, image=file)
    return Response({"status": "ok"})


# ========== HR ENDPOINTS ==========

# HR LOGIN
@api_view(["POST"])
def hr_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if user is HR
    try:
        hr_user = HRUser.objects.get(user=user)
        return Response({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_hr": True
            }
        })
    except HRUser.DoesNotExist:
        return Response({"error": "User is not authorized as HR"}, status=status.HTTP_403_FORBIDDEN)


# GENERATE QUESTIONS WITH AI
@api_view(["POST"])
def generate_ai_questions(request):
    topic = request.data.get("topic")  # Python, Java, etc.
    count = int(request.data.get("count", 50))
    difficulty = request.data.get("difficulty", "medium")
    user_id = request.data.get("user_id")
    
    if not topic:
        return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id) if user_id else None
    except User.DoesNotExist:
        user = None
    
    # Generate questions using AI
    questions = generate_questions(topic, count, difficulty)
    
    # Save generated questions to database
    generated_questions = []
    for q_data in questions:
        gen_q = GeneratedQuestion.objects.create(
            topic=topic,
            question_text=q_data.get("question_text", ""),
            question_type=q_data.get("type", "mcq"),
            options=q_data.get("options", []),
            correct_answer=q_data.get("correct_answer", ""),
            difficulty=q_data.get("difficulty", difficulty),
            generated_by=user
        )
        generated_questions.append({
            "id": gen_q.id,
            "question_text": gen_q.question_text,
            "type": gen_q.question_type,
            "options": gen_q.options,
            "correct_answer": gen_q.correct_answer,
            "difficulty": gen_q.difficulty
        })
    
    return Response({
        "success": True,
        "count": len(generated_questions),
        "questions": generated_questions
    })


# GET GENERATED QUESTIONS
@api_view(["GET"])
def get_generated_questions(request):
    topic = request.GET.get("topic")
    user_id = request.GET.get("user_id")
    
    queryset = GeneratedQuestion.objects.filter(is_selected=False)
    
    if topic:
        queryset = queryset.filter(topic=topic)
    if user_id:
        queryset = queryset.filter(generated_by_id=user_id)
    
    questions = queryset.order_by("-generated_at")
    
    return Response({
        "questions": [{
            "id": q.id,
            "topic": q.topic,
            "question_text": q.question_text,
            "type": q.question_type,
            "options": q.options,
            "correct_answer": q.correct_answer,
            "difficulty": q.difficulty,
            "generated_at": q.generated_at.isoformat()
        } for q in questions]
    })


# SELECT QUESTIONS FOR TEST
@api_view(["POST"])
def select_questions_for_test(request):
    question_ids = request.data.get("question_ids", [])  # List of question IDs
    test_id = request.data.get("test_id")  # Existing test ID or None
    company_id = request.data.get("company_id")
    test_title = request.data.get("test_title")
    test_duration = int(request.data.get("test_duration", 30))
    
    if not question_ids:
        return Response({"error": "No questions selected"}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(question_ids) > 20:
        return Response({"error": "Maximum 20 questions allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get or create test
    if test_id:
        try:
            test = Test.objects.get(test_id=test_id)
        except Test.DoesNotExist:
            return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        if not company_id or not test_title:
            return Response({"error": "company_id and test_title required for new test"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create new test
        test = Test.objects.create(
            company=company,
            test_id=f"{company_id}-{uuid.uuid4().hex[:8]}",
            title=test_title,
            duration=test_duration
        )
    
    # Get selected questions
    selected_questions = GeneratedQuestion.objects.filter(id__in=question_ids, is_selected=False)
    
    if selected_questions.count() != len(question_ids):
        return Response({"error": "Some questions not found or already selected"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create Question objects from selected GeneratedQuestions
    created_questions = []
    for idx, gen_q in enumerate(selected_questions):
        q = Question.objects.create(
            test=test,
            qid=f"q{idx+1}",
            text=gen_q.question_text,
            type=gen_q.question_type
        )
        
        # Create options for MCQ
        if gen_q.question_type == "mcq" and gen_q.options:
            for opt_idx, opt_data in enumerate(gen_q.options):
                Option.objects.create(
                    question=q,
                    option_id=f"opt{opt_idx+1}",
                    text=opt_data.get("text", ""),
                    is_correct=opt_data.get("is_correct", False)
                )
        
        # Mark as selected
        gen_q.is_selected = True
        gen_q.selected_for_test = test
        gen_q.save()
        
        created_questions.append({
            "id": q.id,
            "qid": q.qid,
            "text": q.text,
            "type": q.type
        })
    
    return Response({
        "success": True,
        "test_id": test.test_id,
        "test_title": test.title,
        "questions_added": len(created_questions),
        "questions": created_questions
    })


# DELETE GENERATED QUESTIONS
@api_view(["DELETE"])
def delete_generated_questions(request):
    question_ids = request.data.get("question_ids", [])
    
    if not question_ids:
        return Response({"error": "No question IDs provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    deleted = GeneratedQuestion.objects.filter(id__in=question_ids, is_selected=False).delete()
    
    return Response({
        "success": True,
        "deleted_count": deleted[0]
    })


# ========== HR ANALYTICS ENDPOINTS ==========

# GET TEST ANALYTICS
@api_view(["GET"])
def get_test_analytics(request):
    """Get analytics for all tests or a specific test"""
    test_id = request.GET.get("test_id")
    
    if test_id:
        # Get analytics for specific test
        try:
            test = Test.objects.get(test_id=test_id)
            sessions = Session.objects.filter(test=test)
            
            total_attempts = sessions.count()
            completed = sessions.filter(ended__isnull=False).count()
            
            # Calculate average scores
            mcq_scores = [s.score_mcq for s in sessions if s.score_mcq is not None]
            avg_mcq = sum(mcq_scores) / len(mcq_scores) if mcq_scores else 0
            
            # Score distribution
            score_ranges = {
                "90-100": len([s for s in mcq_scores if 90 <= s <= 100]),
                "80-89": len([s for s in mcq_scores if 80 <= s < 90]),
                "70-79": len([s for s in mcq_scores if 70 <= s < 80]),
                "60-69": len([s for s in mcq_scores if 60 <= s < 70]),
                "0-59": len([s for s in mcq_scores if 0 <= s < 60]),
            }
            
            # Recent attempts
            recent_sessions = sessions.order_by("-started")[:10]
            
            return Response({
                "test_id": test.test_id,
                "test_title": test.title,
                "company": test.company.name,
                "total_attempts": total_attempts,
                "completed": completed,
                "in_progress": total_attempts - completed,
                "average_score": round(avg_mcq, 2),
                "score_distribution": score_ranges,
                "recent_attempts": [{
                    "username": s.username,
                    "started": s.started.isoformat(),
                    "ended": s.ended.isoformat() if s.ended else None,
                    "score_mcq": s.score_mcq,
                    "session_id": str(s.session_id)
                } for s in recent_sessions]
            })
        except Test.DoesNotExist:
            return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Get analytics for all tests
        tests = Test.objects.all()
        analytics = []
        
        for test in tests:
            sessions = Session.objects.filter(test=test)
            total_attempts = sessions.count()
            completed = sessions.filter(ended__isnull=False).count()
            mcq_scores = [s.score_mcq for s in sessions if s.score_mcq is not None]
            avg_mcq = sum(mcq_scores) / len(mcq_scores) if mcq_scores else 0
            
            analytics.append({
                "test_id": test.test_id,
                "test_title": test.title,
                "company": test.company.name,
                "total_attempts": total_attempts,
                "completed": completed,
                "average_score": round(avg_mcq, 2),
                "question_count": test.questions.count()
            })
        
        return Response({
            "tests": analytics,
            "total_tests": len(analytics)
        })


# GET QUESTION PERFORMANCE
@api_view(["GET"])
def get_question_performance(request, test_id):
    """Get performance metrics for each question in a test"""
    try:
        test = Test.objects.get(test_id=test_id)
        questions = test.questions.all()
        
        question_stats = []
        for question in questions:
            # Get all sessions for this test
            sessions = Session.objects.filter(test=test, ended__isnull=False)
            
            if question.type == "mcq":
                # For MCQ, check how many got it right
                correct_option = question.options.filter(is_correct=True).first()
                if correct_option:
                    # This is simplified - in real implementation, you'd need to track individual answers
                    # For now, we'll use session scores as proxy
                    total_attempts = sessions.count()
                    # Estimate based on average score
                    avg_score = sum([s.score_mcq for s in sessions if s.score_mcq]) / total_attempts if total_attempts else 0
                    estimated_correct = int((avg_score / 100) * total_attempts)
                    
                    question_stats.append({
                        "question_id": question.qid,
                        "question_text": question.text[:100],
                        "type": question.type,
                        "total_attempts": total_attempts,
                        "estimated_correct": estimated_correct,
                        "difficulty": "medium"  # Could be calculated based on performance
                    })
            else:
                # For subjective questions
                total_attempts = sessions.count()
                question_stats.append({
                    "question_id": question.qid,
                    "question_text": question.text[:100],
                    "type": question.type,
                    "total_attempts": total_attempts,
                    "average_score": 70  # Default for subjective
                })
        
        return Response({
            "test_id": test_id,
            "questions": question_stats
        })
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)


# GET CANDIDATES FOR TEST (with selection status)
@api_view(["GET"])
def get_candidates(request, test_id):
    """Get all candidates who attempted a test, sorted by score"""
    try:
        test = Test.objects.get(test_id=test_id)
        sessions = Session.objects.filter(test=test, ended__isnull=False).order_by("-score_mcq")
        
        candidates = []
        for session in sessions:
            # Calculate overall score
            mcq_score = session.score_mcq or 0
            subjective_avg = 0
            if session.score_subjective:
                sub_scores = [v for v in session.score_subjective.values() if isinstance(v, (int, float))]
                subjective_avg = sum(sub_scores) / len(sub_scores) if sub_scores else 0
            
            overall_score = round(mcq_score * 0.7 + subjective_avg * 0.3, 2)
            
            candidates.append({
                "username": session.username,
                "session_id": str(session.session_id),
                "started": session.started.isoformat(),
                "ended": session.ended.isoformat() if session.ended else None,
                "mcq_score": mcq_score,
                "subjective_avg": round(subjective_avg, 2),
                "overall_score": overall_score,
                "time_taken": (session.ended - session.started).total_seconds() if session.ended else None,
                "status": "completed" if session.ended else "in_progress"
            })
        
        return Response({
            "test_id": test_id,
            "test_title": test.title,
            "candidates": candidates,
            "total_candidates": len(candidates)
        })
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)
