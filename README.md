# Suman's Kitchen

A web application for sharing family recipes. Upload, organize, and share recipes with friends and family.

**Live site:** https://sumanskitchen.fly.dev

## Features

- **User Authentication** - Email/password and Google OAuth sign-in
- **Recipe Management** - Create, edit, and delete recipes with ingredients and step-by-step directions
- **Public & Private Recipes** - Share recipes publicly or keep them private
- **Image Uploads** - Add photos of your dishes with automatic compression
- **AI Recipe Generation** - Generate recipes from text prompts or extract recipes from images
- **Full-Text Search** - Find recipes by title and keywords
- **Drag-and-Drop Editing** - Reorder ingredients and directions easily

## Tech Stack

**Backend:** FastAPI, Python 3.11+, MongoDB, JWT authentication, OpenAI API, Google Cloud Storage

**Frontend:** React 19, TypeScript, Vite, Redux Toolkit, Material-UI

**Deployment:** Docker, Fly.io

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js and npm
- MongoDB instance
- OpenAI API key
- Google OAuth credentials
- Google Cloud Storage bucket and credentials

### Installation

```bash
# Install all dependencies
make install
```

### Configuration

Create environment files:

**`kitchen-backend/.env`**
```
PORT=3000
ENVIRONMENT=development
MONGODB_URI=mongodb+srv://...
DATABASE_NAME=sumansKitchen
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GCS_BUCKET_NAME=your-bucket
GCS_CREDENTIALS_FILE=/path/to/service-account.json
CORS_ORIGINS=["http://localhost:5173"]
```

**`kitchen-frontend/.env`**
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Running Locally

```bash
# Start backend (port 3000)
make backend

# Start frontend (port 5173)
make frontend
```

### Available Commands

| Command | Description |
|---------|-------------|
| `make install` | Install all dependencies |
| `make backend` | Start FastAPI backend |
| `make frontend` | Start React dev server |
| `make test` | Run backend tests |
| `make build` | Build frontend for production |
| `make deploy` | Build and deploy to Fly.io |

## Project Structure

```
sumans-kitchen/
├── kitchen-backend/       # FastAPI backend
│   ├── app/
│   │   ├── models/        # Pydantic schemas
│   │   ├── routes/        # API endpoints
│   │   └── services/      # Business logic
│   ├── main.py
│   └── tests/
├── kitchen-frontend/      # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── reducers/      # Redux state
│   └── package.json
└── Makefile
```
