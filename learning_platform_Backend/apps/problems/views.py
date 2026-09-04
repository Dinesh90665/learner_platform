from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import FavoriteProblem, Problem
from .serializers import FavoriteProblemSerializer

from .models import Problem
from .serializers import ProblemSerializer


class ProblemListCreateView(generics.ListCreateAPIView):

    queryset = Problem.objects.all().order_by("-created_at")
    serializer_class = ProblemSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]


class ProblemDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]
    

class FavoriteProblemToggleView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, problem_id):
        try:
            problem = Problem.objects.get(
                id=problem_id
            )
        except Problem.DoesNotExist:
            return Response(
                {
                    "detail": "Problem not found."
                },
                status=404,
            )

        favorite, created = FavoriteProblem.objects.get_or_create(
            user=request.user,
            problem=problem,
        )

        if created:
            return Response(
                {
                    "saved": True,
                    "message": "Problem saved.",
                    "favorite": FavoriteProblemSerializer(
                        favorite
                    ).data,
                },
                status=201,
            )

        favorite.delete()

        return Response(
            {
                "saved": False,
                "message": "Problem removed from saved list.",
            },
            status=200,
        )


class FavoriteProblemListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteProblemSerializer

    def get_queryset(self):
        return FavoriteProblem.objects.filter(
            user=self.request.user
        ).select_related(
            "problem"
        ).order_by(
            "-created_at"
        )