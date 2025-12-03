from django.contrib import admin
from django.urls import path
from assessment import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # Public API endpoints
    path("api/companies/", views.get_companies),
    path("api/tests/", views.get_all_tests),
    path("api/test/<str:test_id>/", views.get_test),
    path("api/start-session/", views.start_session),
    path("api/submit/", views.submit_test),
    path("api/log/", views.log_event),
    path("api/upload-snapshot/", views.upload_snapshot),
    
    # HR API endpoints
    path("api/hr/login/", views.hr_login),
    path("api/hr/generate-questions/", views.generate_ai_questions),
    path("api/hr/generated-questions/", views.get_generated_questions),
    path("api/hr/select-questions/", views.select_questions_for_test),
    path("api/hr/delete-questions/", views.delete_generated_questions),
    path("api/hr/analytics/", views.get_test_analytics),
    path("api/hr/question-performance/<str:test_id>/", views.get_question_performance),
    path("api/hr/candidates/<str:test_id>/", views.get_candidates),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
