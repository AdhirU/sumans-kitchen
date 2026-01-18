import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import get_settings
from app.database import close_mongo_connection, connect_to_mongo
from app.routes import recipes, generate

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Suman's Kitchen API",
        description="API for managing recipes",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(recipes.router)
    app.include_router(generate.router)

    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    # Serve static frontend files in production
    public_path = Path(__file__).parent / "public"
    if public_path.exists():
        app.mount("/assets", StaticFiles(directory=public_path / "assets"), name="assets")

        @app.get("/{path:path}")
        async def serve_spa(path: str):
            """Serve index.html for all non-API routes (SPA client-side routing)."""
            return FileResponse(public_path / "index.html")

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
