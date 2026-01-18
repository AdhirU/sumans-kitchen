# syntax = docker/dockerfile:1

FROM python:3.12-slim

LABEL fly_launch_runtime="FastAPI"

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]
