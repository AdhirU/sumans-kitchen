from openai import AsyncOpenAI
from pydantic import BaseModel

from app.config import get_settings
from app.models.recipe import RecipeCreate


class GeneratedRecipe(BaseModel):
    """Schema for the structured output from OpenAI."""

    title: str
    description: str
    ingredients: list[str]
    directions: list[str]


class GenerateService:
    """Service for generating recipes using OpenAI."""

    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def recipe_from_prompt(self, prompt_text: str) -> RecipeCreate:
        """Generate a recipe from a text prompt using OpenAI."""
        completion = await self.client.beta.chat.completions.parse(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Generate a recipe based on the prompt provided. "
                        "The recipe should have a title, a brief description, "
                        "a list of ingredients required, and a list of directions to follow."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt_text,
                },
            ],
            response_format=GeneratedRecipe,
        )

        parsed = completion.choices[0].message.parsed
        if parsed is None:
            raise ValueError("Failed to parse recipe from OpenAI response")

        return RecipeCreate(
            title=parsed.title,
            description=parsed.description,
            ingredients=parsed.ingredients,
            directions=parsed.directions,
        )
