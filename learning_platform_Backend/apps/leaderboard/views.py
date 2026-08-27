from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.submissions.models import Submission


class LeaderboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()

        leaderboard = []

        for user in users:
            submissions = Submission.objects.filter(
                user=user
            )

            total_submissions = submissions.count()

            accepted_submissions = submissions.filter(
                status="accepted"
            ).count()

            solved_problems = submissions.filter(
                status="accepted"
            ).values(
                "problem"
            ).distinct().count()

            success_rate = 0

            if total_submissions > 0:
                success_rate = round(
                    (
                        accepted_submissions
                        / total_submissions
                    ) * 100,
                    2
                )

            leaderboard.append({
                "username": user.username,
                "solved_problems": solved_problems,
                "accepted_submissions": accepted_submissions,
                "total_submissions": total_submissions,
                "success_rate": success_rate,
            })

        leaderboard.sort(
            key=lambda user: (
                user["solved_problems"],
                user["accepted_submissions"],
                user["success_rate"],
            ),
            reverse=True,
        )

        for rank, user in enumerate(
            leaderboard,
            start=1
        ):
            user["rank"] = rank

        return Response({
            "leaderboard": leaderboard
        })