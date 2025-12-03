from django.contrib import admin
from .models import Company, Test, Question, Option, Session, Snapshot, ProctorEvent, HRUser, GeneratedQuestion

# Register your models here.
admin.site.register(Company)
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Session)
admin.site.register(Snapshot)
admin.site.register(ProctorEvent)
admin.site.register(HRUser)
admin.site.register(GeneratedQuestion)
