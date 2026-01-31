from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.models.recipe import GenerateFromPromptRequest, RecipeCreate
from app.services.generate_service import GenerateService

router = APIRouter(prefix="/api/generate", tags=["generate"])


def get_generate_service() -> GenerateService:
    """Dependency that creates a GenerateService."""
    return GenerateService()


@router.post("/from-prompt", response_model=RecipeCreate)
async def generate_from_prompt(
    request: GenerateFromPromptRequest,
    service: GenerateService = Depends(get_generate_service),
) -> RecipeCreate:
    """Generate a recipe from a text prompt using AI."""
    return await service.recipe_from_prompt(request.promptText)


@router.post("/from-image", response_model=RecipeCreate)
async def generate_from_image(
    image: UploadFile = File(...),
    service: GenerateService = Depends(get_generate_service),
) -> RecipeCreate:
    """Extract a recipe from an uploaded image using AI vision."""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_data = await image.read()
    return await service.recipe_from_image(image_data, image.content_type)
