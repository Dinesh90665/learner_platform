from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import Discussion, DiscussionReply


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "problem",
        "user",
        "created_at",
        "updated_at",
    )

    list_display_links = (
        "id",
        "title",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    search_fields = (
        "title",
        "content",
        "user__username",
        "problem__title",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(DiscussionReply)
class DiscussionReplyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "discussion",
        "user",
        "content_preview",
        "created_at",
    )

    list_display_links = (
        "id",
        "discussion",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "content",
        "user__username",
        "discussion__title",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
    )

    def content_preview(self, obj):
        return obj.content[:60]

    content_preview.short_description = "Content"