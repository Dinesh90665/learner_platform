from rest_framework import serializers

from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):

    problem_title = serializers.CharField(
        source="problem.title",
        read_only=True
    )

    problem_slug = serializers.CharField(
        source="problem.slug",
        read_only=True
    )

    class Meta:
        model = Submission

        fields = [
            "id",
            "problem",
            "problem_title",
            "problem_slug",
            "language",
            "source_code",
            "status",
            "output",
            "error",
            "execution_time",
            "memory_used",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "problem_title",
            "problem_slug",
            "status",
            "output",
            "error",
            "execution_time",
            "memory_used",
            "created_at",
        ]