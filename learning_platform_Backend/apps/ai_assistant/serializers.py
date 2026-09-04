from rest_framework import serializers


class AIChatSerializer(serializers.Serializer):

    message = serializers.CharField(
        required=True,
        allow_blank=False,
    )

    problem_id = serializers.IntegerField(
        required=False,
        allow_null=True,
    )

    language = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    source_code = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    error = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    history = serializers.ListField(
        required=False,
        allow_empty=True,
    )