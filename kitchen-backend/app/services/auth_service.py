from datetime import datetime, timedelta, timezone

import httpx
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext

from app.config import Settings, get_settings
from app.models.user import (
    UserCreate,
    UserInDB,
    UserResponse,
    user_from_mongo,
    user_in_db_from_mongo,
)

# Password hashing context - bcrypt with auto-upgrade support
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token extractor for protected routes
bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str, settings: Settings) -> str:
    """Create a JWT access token for the given user ID."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": user_id,  # "sub" (subject) is the standard JWT claim for user identifier
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def verify_token(token: str, settings: Settings) -> str | None:
    """Verify a JWT token and return the user ID if valid.

    Returns None if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        user_id: str = payload.get("sub")
        return user_id
    except JWTError:
        return None


async def verify_google_token(credential: str, settings: Settings) -> dict | None:
    """Verify a Google OAuth credential and return the user info.

    Calls Google's tokeninfo endpoint to validate the token.
    Returns None if invalid or if the token wasn't issued for our app.
    """
    if not settings.google_client_id:
        return None

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
        )

    if response.status_code != 200:
        return None

    token_info = response.json()

    # Verify the token was issued for our app (prevents token substitution attacks)
    if token_info.get("aud") != settings.google_client_id:
        return None

    return {
        "email": token_info.get("email"),
        "name": token_info.get("name"),
        "google_id": token_info.get("sub"),  # Google's unique user ID
    }


class AuthService:
    """Service for user authentication and management."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["users"]

    async def find_by_email(self, email: str) -> UserInDB | None:
        """Find a user by email. Returns internal representation with hashed password."""
        doc = await self.collection.find_one({"email": email})
        if doc:
            return user_in_db_from_mongo(doc)
        return None

    async def find_by_id(self, user_id: str) -> UserResponse | None:
        """Find a user by ID. Returns safe response without sensitive data."""
        try:
            object_id = ObjectId(user_id)
        except InvalidId:
            return None

        doc = await self.collection.find_one({"_id": object_id})
        if doc:
            return user_from_mongo(doc)
        return None

    async def find_by_google_id(self, google_id: str) -> UserInDB | None:
        """Find a user by their Google ID."""
        doc = await self.collection.find_one({"google_id": google_id})
        if doc:
            return user_in_db_from_mongo(doc)
        return None

    async def create_user(
        self,
        email: str,
        name: str,
        hashed_password: str | None = None,
        google_id: str | None = None,
    ) -> UserResponse:
        """Create a new user in the database."""
        doc = {
            "email": email,
            "name": name,
            "hashed_password": hashed_password,
            "google_id": google_id,
        }
        result = await self.collection.insert_one(doc)
        created_doc = await self.collection.find_one({"_id": result.inserted_id})
        return user_from_mongo(created_doc)

    async def register(self, user_data: UserCreate) -> UserResponse:
        """Register a new user with email/password.

        Raises HTTPException if email already exists.
        """
        existing = await self.find_by_email(user_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed = hash_password(user_data.password)
        return await self.create_user(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed,
        )

    async def authenticate(self, email: str, password: str) -> UserResponse | None:
        """Authenticate a user with email/password.

        Returns the user if credentials are valid, None otherwise.
        """
        user = await self.find_by_email(email)
        if not user:
            return None
        if not user.hashed_password:
            # User registered via OAuth, no password set
            return None
        if not verify_password(password, user.hashed_password):
            return None

        return UserResponse(id=user.id, email=user.email, name=user.name)

    async def google_auth(
        self, credential: str, settings: Settings
    ) -> UserResponse | None:
        """Authenticate or register a user via Google OAuth.

        If the user exists (by google_id or email), returns them.
        If not, creates a new user.
        Returns None if the Google token is invalid.
        """
        google_info = await verify_google_token(credential, settings)
        if not google_info:
            return None

        # First, try to find by Google ID (returning user)
        user = await self.find_by_google_id(google_info["google_id"])
        if user:
            return UserResponse(id=user.id, email=user.email, name=user.name)

        # Next, check if email exists (user registered with email, now linking Google)
        user = await self.find_by_email(google_info["email"])
        if user:
            # Link Google ID to existing account
            await self.collection.update_one(
                {"_id": ObjectId(user.id)},
                {"$set": {"google_id": google_info["google_id"]}},
            )
            return UserResponse(id=user.id, email=user.email, name=user.name)

        # New user - create account
        return await self.create_user(
            email=google_info["email"],
            name=google_info["name"],
            google_id=google_info["google_id"],
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> str:
    """FastAPI dependency that extracts and validates the JWT from the request.

    Returns the user_id if valid, raises 401 if not.
    Use this as a dependency in protected routes.
    """
    token = credentials.credentials
    user_id = verify_token(token, settings)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
