from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "problem",
        "language",
        "status",
        "execution_time",
        "created_at",
    )

    list_filter = (
        "language",
        "status",
        "created_at",
    )

    search_fields = (
        "user__username",
        "problem__title",
        "source_code",
    )

    readonly_fields = (
        "status",
        "output",
        "error",
        "execution_time",
        "memory_used",
        "created_at",
    )

    ordering = (
        "-created_at",
    )