from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.problems.models import Problem

from .serializers import AIChatSerializer
from .services import get_ai_response


class AIChatView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = AIChatSerializer

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        data = serializer.validated_data

        problem = None

        problem_id = data.get("problem_id")

        if problem_id:
            try:
                problem = Problem.objects.get(
                    id=problem_id
                )
            except Problem.DoesNotExist:
                return Response(
                    {
                        "detail": "Problem not found."
                    },
                    status=404
                )

        try:
            answer = get_ai_response(
                message=data["message"],
                problem=problem,
                language=data.get(
                    "language",
                    ""
                ),
                source_code=data.get(
                    "source_code",
                    ""
                ),
                error=data.get(
                    "error",
                    ""
                ),
                history=data.get(
                    "history",
                    []
                ),
            )

            return Response(
                {
                    "answer": answer
                },
                status=200
            )

        except Exception as exc:
            return Response(
                {
                    "detail": str(exc)
                },
                status=500
            )