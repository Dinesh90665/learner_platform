from rest_framework import serializers

from .models import Problem


class ProblemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem
        fields = "__all__"


from rest_framework import serializers

from .models import FavoriteProblem


class FavoriteProblemSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(
        source="problem.title",
        read_only=True,
    )

    problem_slug = serializers.CharField(
        source="problem.slug",
        read_only=True,
    )

    class Meta:
        model = FavoriteProblem

        fields = [
            "id",
            "problem",
            "problem_title",
            "problem_slug",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "problem_title",
            "problem_slug",
            "created_at",
        ]