from rest_framework import serializers

from .models import Discussion, DiscussionReply


class DiscussionReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = DiscussionReply

        fields = [
            "id",
            "discussion",
            "username",
            "content",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "discussion",
            "username",
            "created_at",
        ]


class DiscussionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    replies = DiscussionReplySerializer(
        many=True,
        read_only=True,
    )

    reply_count = serializers.IntegerField(
        source="replies.count",
        read_only=True,
    )

    class Meta:
        model = Discussion

        fields = [
            "id",
            "problem",
            "username",
            "title",
            "content",
            "reply_count",
            "replies",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "problem",
            "username",
            "reply_count",
            "replies",
            "created_at",
            "updated_at",
        ]