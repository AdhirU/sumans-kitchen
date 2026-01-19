from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base schema with fields shared by all user models."""

    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    """Schema for email/password registration."""

    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for email/password login."""

    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    """Schema for Google OAuth login/registration.

    The credential is the ID token returned by Google Sign-In on the frontend.
    """

    credential: str


class UserResponse(UserBase):
    """Schema for API responses. Never includes password or sensitive data."""

    id: str = Field(..., description="User ID")


class TokenResponse(BaseModel):
    """Schema for authentication responses containing JWT."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserInDB(UserBase):
    """Internal schema representing a user as stored in MongoDB.

    This is never exposed directly via the API.
    """

    id: str
    hashed_password: str | None = None  # None for OAuth-only users
    google_id: str | None = None  # None for email/password-only users


def user_from_mongo(doc: dict) -> UserResponse:
    """Transform a MongoDB document into a UserResponse.

    MongoDB stores the ID as '_id' (ObjectId), but our API returns 'id' (string).
    This function strips sensitive fields (hashed_password, google_id).
    """
    return UserResponse(
        id=str(doc["_id"]),
        email=doc["email"],
        name=doc["name"],
    )


def user_in_db_from_mongo(doc: dict) -> UserInDB:
    """Transform a MongoDB document into a UserInDB for internal use.

    Used when we need access to hashed_password or google_id for verification.
    """
    return UserInDB(
        id=str(doc["_id"]),
        email=doc["email"],
        name=doc["name"],
        hashed_password=doc.get("hashed_password"),
        google_id=doc.get("google_id"),
    )
