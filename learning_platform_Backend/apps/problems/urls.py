from django.urls import path
from .views import (
    FavoriteProblemToggleView,
    FavoriteProblemListView,
)

from .views import (
    ProblemListCreateView,
    ProblemDetailView,
)


urlpatterns = [
    path(
        "",
        ProblemListCreateView.as_view(),
        name="problem-list-create",
    ),

    path(
        "<slug:slug>/",
        ProblemDetailView.as_view(),
        name="problem-detail",
    ),
    
    path(
        "favorites/",
        FavoriteProblemListView.as_view(),
        name="favorite-list",
    ),

    path(
        "<int:problem_id>/favorite/",
        FavoriteProblemToggleView.as_view(),
        name="favorite-toggle",
    ),
]