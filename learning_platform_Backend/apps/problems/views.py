from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

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