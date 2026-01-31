from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from bson.errors import InvalidId

from app.models.recipe import RecipeCreate, RecipeResponse, RecipeUpdate, recipe_from_mongo


class RecipeService:
    """Service for recipe CRUD operations."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["recipes"]

    async def get_public(self) -> list[RecipeResponse]:
        """Get all public recipes from the database."""
        recipes = []
        async for doc in self.collection.find({"is_public": True}):
            recipes.append(recipe_from_mongo(doc))
        return recipes

    async def get_by_user(self, user_id: str) -> list[RecipeResponse]:
        """Get all recipes owned by a specific user."""
        recipes = []
        async for doc in self.collection.find({"user_id": user_id}):
            recipes.append(recipe_from_mongo(doc))
        return recipes

    async def find_by_id(self, recipe_id: str) -> RecipeResponse | None:
        """Find a recipe by its ID. Returns None if not found or invalid ID."""
        try:
            object_id = ObjectId(recipe_id)
        except InvalidId:
            return None

        doc = await self.collection.find_one({"_id": object_id})
        if doc:
            return recipe_from_mongo(doc)
        return None

    async def add_recipe(self, recipe: RecipeCreate, user_id: str) -> RecipeResponse:
        """Add a new recipe to the database."""
        doc = recipe.model_dump()
        doc["user_id"] = user_id
        result = await self.collection.insert_one(doc)

        created_doc = await self.collection.find_one({"_id": result.inserted_id})
        return recipe_from_mongo(created_doc)

    async def update_recipe(
        self, recipe_id: str, recipe: RecipeUpdate
    ) -> RecipeResponse | None:
        """Update an existing recipe. Returns None if not found or invalid ID."""
        try:
            object_id = ObjectId(recipe_id)
        except InvalidId:
            return None

        update_data = {
            "title": recipe.title,
            "description": recipe.description,
            "ingredients": recipe.ingredients,
            "directions": recipe.directions,
            "is_public": recipe.is_public,
            "image_url": recipe.image_url,
        }

        result = await self.collection.find_one_and_update(
            {"_id": object_id},
            {"$set": update_data},
            return_document=True,
        )

        if result:
            return recipe_from_mongo(result)
        return None

    async def delete_by_id(self, recipe_id: str) -> bool:
        """Delete a recipe by its ID. Returns True if deleted, False if not found."""
        try:
            object_id = ObjectId(recipe_id)
        except InvalidId:
            return False

        result = await self.collection.delete_one({"_id": object_id})
        return result.deleted_count > 0

    async def update_image(
        self, recipe_id: str, image_url: str | None
    ) -> RecipeResponse | None:
        """Update a recipe's image URL. Returns None if not found or invalid ID."""
        try:
            object_id = ObjectId(recipe_id)
        except InvalidId:
            return None

        result = await self.collection.find_one_and_update(
            {"_id": object_id},
            {"$set": {"image_url": image_url}},
            return_document=True,
        )

        if result:
            return recipe_from_mongo(result)
        return None
