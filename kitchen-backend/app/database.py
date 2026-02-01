from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


database = Database()


async def connect_to_mongo():
    """Connect to MongoDB using Motor async driver."""
    settings = get_settings()
    logger.info("Connecting to MongoDB...")

    database.client = AsyncIOMotorClient(settings.effective_mongodb_uri)
    database.db = database.client[settings.database_name]

    # Verify connection
    await database.client.admin.command("ping")
    logger.info("Connected to MongoDB")

    # Create text index for recipe search (idempotent - skips if exists)
    await database.db["recipes"].create_index(
        [("title", "text"), ("description", "text"), ("ingredients", "text")],
        name="recipe_text_search",
    )
    logger.info("Created text search index on recipes")


async def close_mongo_connection():
    """Close MongoDB connection."""
    if database.client:
        database.client.close()
        logger.info("Closed MongoDB connection")


def get_database() -> AsyncIOMotorDatabase:
    """Dependency to get database instance."""
    if database.db is None:
        raise RuntimeError("Database not connected")
    return database.db
