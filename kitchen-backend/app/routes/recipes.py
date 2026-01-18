from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_database
from app.models.recipe import RecipeCreate, RecipeResponse, RecipeUpdate
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


def get_recipe_service(
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> RecipeService:
    """Dependency that creates a RecipeService with the database."""
    return RecipeService(db)


@router.get("", response_model=list[RecipeResponse])
async def get_all_recipes(
    service: RecipeService = Depends(get_recipe_service),
) -> list[RecipeResponse]:
    """Get all recipes."""
    return await service.get_all()


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Get a single recipe by ID."""
    recipe = await service.find_by_id(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return recipe


@router.post("", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe: RecipeCreate,
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Create a new recipe."""
    return await service.add_recipe(recipe)


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeUpdate,
    service: RecipeService = Depends(get_recipe_service),
) -> RecipeResponse:
    """Update an existing recipe."""
    updated = await service.update_recipe(recipe_id, recipe)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return updated


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    service: RecipeService = Depends(get_recipe_service),
) -> None:
    """Delete a recipe."""
    await service.delete_by_id(recipe_id)
