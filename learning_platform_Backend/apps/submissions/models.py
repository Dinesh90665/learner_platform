from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

from apps.problems.models import Problem


class Submission(models.Model):

    LANGUAGE_CHOICES = [
        ("python", "Python"),
        ("cpp", "C++"),
        ("java", "Java"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("accepted", "Accepted"),
        ("wrong_answer", "Wrong Answer"),
        ("runtime_error", "Runtime Error"),
        ("compilation_error", "Compilation Error"),
        ("time_limit", "Time Limit Exceeded"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES,
    )

    source_code = models.TextField()

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="pending",
    )

    output = models.TextField(
        blank=True,
        default="",
    )

    error = models.TextField(
        blank=True,
        default="",
    )

    execution_time = models.FloatField(
        null=True,
        blank=True,
    )

    memory_used = models.FloatField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.problem.title}"