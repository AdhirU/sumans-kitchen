from pydantic import BaseModel, Field


class RecipeBase(BaseModel):
    """Base schema with fields shared by all recipe models."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    ingredients: list[str] = Field(default_factory=list)
    directions: list[str] = Field(default_factory=list)


class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe. No id field since MongoDB generates it."""

    pass


class RecipeResponse(RecipeBase):
    """Schema for API responses. Includes the id field."""

    id: str = Field(..., description="Recipe ID")


class RecipeUpdate(RecipeBase):
    """Schema for updating a recipe. Includes id in body to identify the recipe."""

    id: str


class GenerateFromPromptRequest(BaseModel):
    """Schema for the generate-from-prompt endpoint."""

    promptText: str = Field(..., min_length=1)


def recipe_from_mongo(doc: dict) -> RecipeResponse:
    """Transform a MongoDB document into a RecipeResponse.

    MongoDB stores the ID as '_id' (ObjectId), but our API returns 'id' (string).
    """
    return RecipeResponse(
        id=str(doc["_id"]),
        title=doc["title"],
        description=doc["description"],
        ingredients=doc.get("ingredients", []),
        directions=doc.get("directions", []),
    )
