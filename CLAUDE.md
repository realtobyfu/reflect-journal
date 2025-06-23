# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint
- `npm test` - Run Jest unit and integration tests
- `npm run test:watch` - Run tests in watch mode

### Backend (FastAPI)
- `cd backend && source venv/bin/activate` - Activate Python virtual environment
- `./dev.sh` - Start development server with health checks (recommended)
- `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` - Alternative direct start
- `pytest` - Run Python unit tests
- `pytest -v` - Run tests with verbose output
- Backend runs on localhost:8000 with docs at /docs

### Database Setup
- `createdb journaldb` - Create PostgreSQL database
- Database migrations handled automatically via SQLAlchemy

## Architecture Overview

This is a full-stack reflective journal application with a Next.js frontend and FastAPI backend.

### Authentication Architecture
- **Dual Authentication System**: Firebase Auth (frontend) + JWT tokens (backend)
- Firebase handles user registration/login, backend validates Firebase ID tokens
- `AuthProvider` in `lib/auth.tsx` manages authentication state
- `apiClient` in `lib/api-client.ts` automatically attaches Firebase ID tokens to requests
- Backend creates/links users via Firebase UID in `app/api/auth.py`

### Frontend Structure
- **App Router**: Uses Next.js 14 app directory structure
- **State Management**: React Context for auth, React Query for server state
- **UI Components**: Radix UI + Tailwind CSS in `components/ui/`
- **Route Protection**: Automatic redirects in `AuthProvider` based on auth state

### Backend Structure
- **FastAPI**: Main app in `backend/app/main.py` with modular API routers
- **Database**: PostgreSQL with SQLAlchemy ORM, models in `app/models.py`
- **API Modules**: Organized by feature in `app/api/` (auth, entries, stats, ai, search, export, analytics)
- **Services**: Business logic in `app/services/` (AI, export, storage)

### Key Data Models
- **User**: Firebase UID linking, profile data
- **JournalEntry**: Content, mood, location, tags, word count, attachments
- **Attachment**: File uploads linked to entries

### API Client Pattern
The `apiClient` class handles:
- Automatic Firebase token refresh and attachment
- Request/response logging for debugging
- Error handling with automatic redirect on 401
- Type-safe interfaces for all API responses

### Environment Requirements
- **Frontend**: `NEXT_PUBLIC_API_URL` (defaults to localhost:8000)
- **Backend**: `DATABASE_URL`, `SECRET_KEY`, Firebase service account key
- **Dependencies**: PostgreSQL 14+, Redis (optional), Python 3.11+, Node.js 18+

## Development Patterns

### Test-Driven Development
When completing each phase of development:
1.	Write unit tests first for the functionality you intend to build.
2.	Then write the code required to satisfy those tests.
3.	Iterate until all tests pass. The unit tests are the source of truth—do not alter or delete tests just to make them pass.
4.	Once all tests pass, perform a refactoring pass to clean up and optimize code without changing functionality.
5.	Only then, mark the phase complete in stages.md.

### Adding New API Endpoints
1. Define route in appropriate `backend/app/api/*.py` file
2. Add method to `apiClient` class in `lib/api-client.ts`
3. Update TypeScript interfaces if needed

### Authentication Flow
- Frontend uses Firebase Auth for login/register
- Backend validates Firebase ID tokens via Firebase Admin SDK
- User data synced between Firebase and PostgreSQL

### File Structure
- Frontend components organized by feature in `components/`
- Backend follows FastAPI best practices with separation of routes, models, and services
- Shared types defined in `lib/api-client.ts`