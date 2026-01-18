.PHONY: backend frontend install install-backend install-frontend test build deploy

# Start the FastAPI backend
backend:
	cd kitchen-backend && .venv/bin/python main.py

# Start the React frontend
frontend:
	cd kitchen-frontend && npm run dev

# Install all dependencies
install: install-backend install-frontend

# Install backend dependencies
install-backend:
	cd kitchen-backend && python3 -m venv .venv && . .venv/bin/activate && pip install -e ".[dev]"

# Install frontend dependencies
install-frontend:
	cd kitchen-frontend && npm install

# Run backend tests
test:
	cd kitchen-backend && .venv/bin/pytest

# Build frontend and copy to backend for production
build:
	cd kitchen-frontend && npm run build
	rm -rf kitchen-backend/public
	cp -r kitchen-frontend/dist kitchen-backend/public

# Deploy to Fly.io
deploy: build
	cd kitchen-backend && fly deploy

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make backend          - Start the FastAPI backend"
	@echo "  make frontend         - Start the React frontend"
	@echo "  make install          - Install all dependencies"
	@echo "  make install-backend  - Install backend dependencies only"
	@echo "  make install-frontend - Install frontend dependencies only"
	@echo "  make test             - Run backend tests"
	@echo "  make build            - Build frontend for production"
	@echo "  make deploy           - Build and deploy to Fly.io"
