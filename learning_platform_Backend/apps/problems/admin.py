from django.contrib import admin

from .models import Problem, TestCase


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "problem",
        "is_sample",
    )

    list_filter = (
        "is_sample",
        "problem",
    )

    search_fields = (
        "problem__title",
        "input_data",
        "expected_output",
    )


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "difficulty",
        "slug",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "difficulty",
        "created_at",
    )

    search_fields = (
        "title",
        "slug",
        "description",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    ordering = (
        "-created_at",
    )