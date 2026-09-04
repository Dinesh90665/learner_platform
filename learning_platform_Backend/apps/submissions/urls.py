from django.urls import path
from .views import (
    SubmissionCreateView,
    SubmissionRunView,
    SubmissionHistoryView,
    DashboardView,
    ProblemProgressView,
)
from .views import UserStreakView
from .views import (
    SubmissionCreateView,
    SubmissionRunView,
    SubmissionHistoryView,
    DashboardView,
)

urlpatterns = [
    path(
        "",
        SubmissionCreateView.as_view(),
        name="submission-create",
    ),

    path(
        "run/",
        SubmissionRunView.as_view(),
        name="submission-run",
    ),

    path(
        "history/",
        SubmissionHistoryView.as_view(),
        name="submission-history",
    ),

    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard",
    ),
    path(
    "progress/",
    ProblemProgressView.as_view(),
    name="problem-progress",
),
   path(
    "streak/",
    UserStreakView.as_view(),
    name="user-streak",
),
   
]