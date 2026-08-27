from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    register,
    profile,
    update_profile,
)


urlpatterns = [

    # Register
    path(
        "register/",
        register,
        name="register"
    ),

    # Login
    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login"
    ),

    # Refresh JWT
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh"
    ),

    # Profile
    path(
        "profile/",
        profile,
        name="profile"
    ),

    # Update profile
    path(
        "profile/update/",
        update_profile,
        name="profile-update"
    ),
]