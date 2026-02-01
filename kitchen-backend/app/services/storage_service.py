import io
import json
import uuid

from google.cloud import storage
from google.oauth2 import service_account
from PIL import Image

from app.config import Settings, get_settings

MAX_IMAGE_WIDTH = 1200
JPEG_QUALITY = 85


class StorageService:
    """Service for uploading files to Google Cloud Storage."""

    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.client: storage.Client | None = None
        self.bucket: storage.Bucket | None = None

        if not self.settings.gcs_bucket_name:
            return

        credentials = None

        # Try JSON string first (for production/Fly.io)
        if self.settings.gcs_credentials_json:
            credentials_info = json.loads(self.settings.gcs_credentials_json)
            credentials = service_account.Credentials.from_service_account_info(
                credentials_info
            )
        # Fall back to file path (for local development)
        elif self.settings.gcs_credentials_file:
            credentials = service_account.Credentials.from_service_account_file(
                self.settings.gcs_credentials_file
            )

        if credentials:
            self.client = storage.Client(credentials=credentials)
            self.bucket = self.client.bucket(self.settings.gcs_bucket_name)

    def is_configured(self) -> bool:
        """Check if GCS is properly configured."""
        return self.bucket is not None

    def _compress_image(self, image_data: bytes) -> tuple[bytes, str]:
        """Compress and resize image, returning (compressed_data, content_type)."""
        image = Image.open(io.BytesIO(image_data))

        # Convert to RGB if necessary (handles PNG with transparency, etc.)
        if image.mode in ("RGBA", "LA", "P"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            if image.mode == "P":
                image = image.convert("RGBA")
            background.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
            image = background
        elif image.mode != "RGB":
            image = image.convert("RGB")

        # Resize if width exceeds maximum
        if image.width > MAX_IMAGE_WIDTH:
            ratio = MAX_IMAGE_WIDTH / image.width
            new_height = int(image.height * ratio)
            image = image.resize((MAX_IMAGE_WIDTH, new_height), Image.LANCZOS)

        # Compress to JPEG
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        return output.getvalue(), "image/jpeg"

    def upload_image(
        self, image_data: bytes, content_type: str, folder: str = "recipes"
    ) -> str | None:
        """Upload an image to GCS and return the public URL.

        Images are automatically compressed and resized before upload.
        Returns None if GCS is not configured.
        """
        if not self.is_configured():
            return None

        # Compress and resize image
        compressed_data, content_type = self._compress_image(image_data)

        # Generate unique filename (always jpg after compression)
        filename = f"{folder}/{uuid.uuid4()}.jpg"

        blob = self.bucket.blob(filename)
        blob.upload_from_string(compressed_data, content_type=content_type)

        # Public access is controlled at bucket level (uniform bucket-level access)
        return f"https://storage.googleapis.com/{self.settings.gcs_bucket_name}/{filename}"

    def delete_image(self, image_url: str) -> bool:
        """Delete an image from GCS by its URL.

        Returns True if deleted, False otherwise.
        """
        if not self.is_configured() or not image_url:
            return False

        try:
            # Extract blob name from URL
            # URL format: https://storage.googleapis.com/bucket-name/path/to/file
            bucket_url = f"https://storage.googleapis.com/{self.settings.gcs_bucket_name}/"
            if not image_url.startswith(bucket_url):
                return False

            blob_name = image_url[len(bucket_url) :]
            blob = self.bucket.blob(blob_name)
            blob.delete()
            return True
        except Exception:
            return False


def get_storage_service() -> StorageService:
    """Dependency that creates a StorageService."""
    return StorageService()
