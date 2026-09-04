from django.urls import path

from .views import (
    DiscussionListCreateView,
    DiscussionReplyCreateView,
)


urlpatterns = [
    path(
        "problem/<int:problem_id>/",
        DiscussionListCreateView.as_view(),
        name="discussion-list-create",
    ),

    path(
        "<int:discussion_id>/reply/",
        DiscussionReplyCreateView.as_view(),
        name="discussion-reply-create",
    ),
]