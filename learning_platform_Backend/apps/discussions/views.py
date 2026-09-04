from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.problems.models import Problem

from .models import Discussion, DiscussionReply
from .serializers import (
    DiscussionReplySerializer,
    DiscussionSerializer,
)


class DiscussionListCreateView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = DiscussionSerializer

    def get(self, request, problem_id):

        discussions = (
            Discussion.objects
            .filter(problem_id=problem_id)
            .select_related("user")
            .prefetch_related("replies__user")
            .order_by("-created_at")
        )

        serializer = DiscussionSerializer(
            discussions,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request, problem_id):

        problem = get_object_or_404(
            Problem,
            id=problem_id,
        )

        serializer = DiscussionSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        discussion = serializer.save(
            user=request.user,
            problem=problem,
        )

        return Response(
            DiscussionSerializer(discussion).data,
            status=201,
        )


class DiscussionReplyCreateView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, discussion_id):

        discussion = get_object_or_404(
            Discussion,
            id=discussion_id,
        )

        serializer = DiscussionReplySerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        reply = serializer.save(
            user=request.user,
            discussion=discussion,
        )

        return Response(
            DiscussionReplySerializer(reply).data,
            status=201,
        )