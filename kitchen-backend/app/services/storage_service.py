import json
import uuid

from google.cloud import storage
from google.oauth2 import service_account

from app.config import Settings, get_settings


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

    def upload_image(
        self, image_data: bytes, content_type: str, folder: str = "recipes"
    ) -> str | None:
        """Upload an image to GCS and return the public URL.

        Returns None if GCS is not configured.
        """
        if not self.is_configured():
            return None

        # Generate unique filename
        extension = content_type.split("/")[-1]
        if extension == "jpeg":
            extension = "jpg"
        filename = f"{folder}/{uuid.uuid4()}.{extension}"

        blob = self.bucket.blob(filename)
        blob.upload_from_string(image_data, content_type=content_type)

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
