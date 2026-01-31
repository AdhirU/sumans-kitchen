from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.models.recipe import RecipeCreate, RecipeResponse, RecipeUpdate
from app.services.auth_service import get_current_user, get_current_user_optional
from app.services.recipe_service import RecipeService
from app.services.storage_service import StorageService, get_storage_service

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


def get_recipe_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> RecipeService:
    """Dependency that creates a RecipeService with the database."""
    return RecipeService(db)


@router.get("", response_model=list[RecipeResponse])
async def get_public_recipes(
    service: RecipeService = Depends(get_recipe_service),
) -> list[RecipeResponse]:
    """Get all public recipes."""
    return await service.get_public()


@router.get("/mine", response_model=list[RecipeResponse])
async def get_my_recipes(
    user_id: str = Depends(get_current_user),
    service: RecipeService = Depends(get_recipe_service),
) -> list[RecipeResponse]:
    """Get all recipes owned by the current user. Requires authentication."""
    return await service.get_by_user(user_id)


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    user_id: str | None = Depends(get_current_user_optional),
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Get a single recipe by ID. Returns public recipes or user's own private recipes."""
    recipe = await service.find_by_id(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    if not recipe.is_public and recipe.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return recipe


@router.post("", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe: RecipeCreate,
    user_id: str = Depends(get_current_user),
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Create a new recipe. Requires authentication."""
    return await service.add_recipe(recipe, user_id)


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeUpdate,
    user_id: str = Depends(get_current_user),
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Update an existing recipe. Requires authentication and ownership."""
    existing = await service.find_by_id(recipe_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    if existing.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't own this recipe",
        )
    return await service.update_recipe(recipe_id, recipe)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    user_id: str = Depends(get_current_user),
    service: RecipeService = Depends(get_recipe_service),
) -> None:
    """Delete a recipe. Requires authentication and ownership."""
    existing = await service.find_by_id(recipe_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    if existing.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't own this recipe",
        )
    await service.delete_by_id(recipe_id)


@router.post("/{recipe_id}/image", response_model=RecipeResponse)
async def upload_recipe_image(
    recipe_id: str,
    image: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
    service: RecipeService = Depends(get_recipe_service),
    storage: StorageService = Depends(get_storage_service),
) -> RecipeResponse:
    """Upload an image for a recipe. Requires authentication and ownership."""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )

    existing = await service.find_by_id(recipe_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    if existing.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't own this recipe",
        )

    if not storage.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image storage is not configured",
        )

    # Delete old image if exists
    if existing.image_url:
        storage.delete_image(existing.image_url)

    # Upload new image
    image_data = await image.read()
    image_url = storage.upload_image(image_data, image.content_type)

    # Update recipe with new image URL
    return await service.update_image(recipe_id, image_url)
