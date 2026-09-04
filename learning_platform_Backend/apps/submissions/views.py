from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import timedelta

from django.utils import timezone

from apps.users.models import UserStreak

from .models import Submission
from .serializers import SubmissionSerializer
from .judge import judge_submission

def update_user_streak(user):
    today = timezone.localdate()

    streak, _ = UserStreak.objects.get_or_create(
        user=user
    )

    if streak.last_solved_date == today:
        return streak

    if (
        streak.last_solved_date
        == today - timedelta(days=1)
    ):
        streak.current_streak += 1
    else:
        streak.current_streak = 1

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = (
            streak.current_streak
        )

    streak.last_solved_date = today

    streak.save()

    return streak

class SubmissionCreateView(generics.CreateAPIView):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        submission = serializer.save(
            user=request.user,
            status="running",
        )

        test_cases = submission.problem.test_cases.all()

        result = judge_submission(
            source_code=submission.source_code,
            language=submission.language,
            test_cases=test_cases,
        )

        submission.status = result["status"]
        submission.output = result["output"]
        submission.error = result["error"]
        submission.execution_time = result["execution_time"]

        submission.save()
        if submission.status == "accepted":
            update_user_streak(request.user)

        return Response(
            self.get_serializer(submission).data,
            status=201,
        )


class SubmissionRunView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        problem_id = request.data.get("problem")
        language = request.data.get("language")
        source_code = request.data.get("source_code")

        if not problem_id:
            return Response(
                {"detail": "Problem is required."},
                status=400,
            )

        if not language:
            return Response(
                {"detail": "Language is required."},
                status=400,
            )

        if not source_code:
            return Response(
                {"detail": "Source code is required."},
                status=400,
            )

        from apps.problems.models import Problem

        try:
            problem = Problem.objects.get(id=problem_id)
        except Problem.DoesNotExist:
            return Response(
                {"detail": "Problem not found."},
                status=404,
            )

        # Run only sample test cases
        test_cases = problem.test_cases.filter(
            is_sample=True
        )

        if not test_cases.exists():
            return Response(
                {
                    "detail": "No sample test cases available."
                },
                status=400,
            )

        result = judge_submission(
            source_code=source_code,
            language=language,
            test_cases=test_cases,
        )

        return Response(
            {
                "status": result["status"],
                "output": result["output"],
                "error": result["error"],
                "execution_time": result["execution_time"],
            },
            status=200,
        )


class SubmissionHistoryView(generics.ListAPIView):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Submission.objects.filter(
            user=self.request.user
        ).select_related(
            "problem"
        ).order_by(
            "-created_at"
        )
    



class DashboardView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        submissions = Submission.objects.filter(
            user=user
        )

        total_submissions = submissions.count()

        accepted_submissions = submissions.filter(
            status="accepted"
        ).count()

        wrong_answers = submissions.filter(
            status="wrong_answer"
        ).count()

        solved_problems = submissions.filter(
            status="accepted"
        ).values(
            "problem"
        ).distinct().count()

        success_rate = 0

        if total_submissions > 0:
            success_rate = round(
                (accepted_submissions / total_submissions) * 100,
                2
            )

        easy_solved = submissions.filter(
            status="accepted",
            problem__difficulty="Easy"
        ).values(
            "problem"
        ).distinct().count()

        medium_solved = submissions.filter(
            status="accepted",
            problem__difficulty="Medium"
        ).values(
            "problem"
        ).distinct().count()

        hard_solved = submissions.filter(
            status="accepted",
            problem__difficulty="Hard"
        ).values(
            "problem"
        ).distinct().count()

        recent_submissions = submissions.select_related(
            "problem"
        ).order_by(
            "-created_at"
        )[:5]

        recent_data = []

        for submission in recent_submissions:

            recent_data.append({
                "id": submission.id,
                "problem": submission.problem.title,
                "problem_slug": submission.problem.slug,
                "language": submission.language,
                "status": submission.status,
                "execution_time": submission.execution_time,
                "created_at": submission.created_at,
            })

        return Response({
            "username": user.username,

            "statistics": {
                "total_submissions": total_submissions,
                "accepted_submissions": accepted_submissions,
                "wrong_answers": wrong_answers,
                "solved_problems": solved_problems,
                "success_rate": success_rate,
            },

            "difficulty": {
                "easy": easy_solved,
                "medium": medium_solved,
                "hard": hard_solved,
            },

            "recent_submissions": recent_data,
        })


class ProblemProgressView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        solved_problem_ids = (
            Submission.objects
            .filter(
                user=request.user,
                status="accepted",
            )
            .values_list(
                "problem_id",
                flat=True,
            )
            .distinct()
        )

        return Response({
            "solved_problem_ids": list(
                solved_problem_ids
            )
        })
    
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.models import UserStreak


class UserStreakView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        streak, _ = UserStreak.objects.get_or_create(
            user=request.user
        )

        return Response({
            "current_streak": streak.current_streak,
            "longest_streak": streak.longest_streak,
            "last_solved_date": streak.last_solved_date,
        })