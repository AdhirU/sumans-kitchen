from fastapi import APIRouter, Depends

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
