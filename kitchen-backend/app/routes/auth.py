from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import Settings, get_settings
from app.database import get_database
from app.models.user import (
    GoogleAuthRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.auth_service import (
    AuthService,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_auth_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> AuthService:
    """Dependency that creates an AuthService with the database."""
    return AuthService(db)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    """Register a new user with email and password.

    Returns a JWT token and user info on success.
    Raises 400 if email is already registered.
    """
    user = await service.register(user_data)
    token = create_access_token(user.id, settings)

    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    """Authenticate with email and password.

    Returns a JWT token and user info on success.
    Raises 401 if credentials are invalid.
    """
    user = await service.authenticate(credentials.email, credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.id, settings)
    return TokenResponse(access_token=token, user=user)


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    request: GoogleAuthRequest,
    service: AuthService = Depends(get_auth_service),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    """Authenticate or register with Google OAuth.

    Accepts a Google ID token (credential) from the frontend.
    Creates a new user if this is their first login.
    Returns a JWT token and user info on success.
    Raises 401 if the Google token is invalid.
    """
    user = await service.google_auth(request.credential, settings)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential",
        )

    token = create_access_token(user.id, settings)
    return TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: str = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """Get the current authenticated user's info.

    Requires a valid JWT token in the Authorization header.
    Raises 401 if not authenticated.
    Raises 404 if user no longer exists (edge case).
    """
    user = await service.find_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
