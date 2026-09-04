from django.db import models
from django.conf import settings

# Create your models here.



class Problem(models.Model):

    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    title = models.CharField(max_length=200)

    slug = models.SlugField(
        unique=True
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES
    )

    description = models.TextField()

    input_format = models.TextField(
        blank=True
    )

    output_format = models.TextField(
        blank=True
    )

    constraints = models.TextField(
        blank=True
    )

    sample_input = models.TextField(
        blank=True
    )

    sample_output = models.TextField(
        blank=True
    )

    explanation = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title
    
class TestCase(models.Model):
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name="test_cases",
    )

    input_data = models.TextField(
        blank=True,
        default="",
    )

    expected_output = models.TextField()

    is_sample = models.BooleanField(
        default=False,
    )

    def __str__(self):
        return f"{self.problem.title} - Test Case {self.id}"
    


class FavoriteProblem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_problems",
    )

    problem = models.ForeignKey(
        "Problem",
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "problem"],
                name="unique_user_favorite_problem",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.problem.title}"