from assessment.models import Company, Test, Question, Option

def run():
    Company.objects.all().delete()
    Test.objects.all().delete()

    tcs = Company.objects.create(id="tcs", name="TCS")
    google = Company.objects.create(id="google", name="Google")

    # TCS Test
    t1 = Test.objects.create(company=tcs, test_id="tcs-backend-1", title="TCS Backend Mock", duration=20)

    q1 = Question.objects.create(test=t1, qid="q1", text="Which is a Python framework?", type="mcq")
    Option.objects.create(question=q1, option_id="o1", text="React", is_correct=False)
    Option.objects.create(question=q1, option_id="o2", text="Django", is_correct=True)

    q2 = Question.objects.create(test=t1, qid="q2", text="Explain REST API", type="subjective")

    # Google
    g1 = Test.objects.create(company=google, test_id="g-ml-1", title="Google ML Mock", duration=30)
    qg = Question.objects.create(test=g1, qid="g1", text="Overfitting meaning?", type="mcq")
    Option.objects.create(question=qg, option_id="o1", text="Fits noise", is_correct=True)
