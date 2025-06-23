# Reflective Journal - Phase 1 Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 14+
- Redis (optional for Phase 1)

## Backend Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL database:
```bash
# Create a new database
createdb journaldb

# Or using psql
psql -U postgres
CREATE DATABASE journaldb;
```

5. Create `.env` file in backend directory:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost/journaldb
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
API documentation at http://localhost:8000/docs

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Testing the Application

1. Visit http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create a new account
4. Start creating journal entries with:
   - Text content
   - Mood selection
   - Photo attachments
   - Location tagging


Frontend: No test framework currently configured. Need to add Jest + React Testing Library.

Backend: No test files exist yet. Need to add pytest.
* Frontend: npm test (after setup)
* Backend: pytest (after setup)


## Docker Setup (Optional)

Use the provided docker-compose.yml for easier setup:

```bash
docker-compose up -d
```


This will start PostgreSQL and Redis automatically.

## Phase 1 Features Implemented

✅ User authentication (register/login)
✅ Create, read, update, delete journal entries
✅ Mood tracking with emoji selector
✅ Photo attachments
✅ Location tagging with geolocation
✅ Word count tracking
✅ Basic statistics (total entries, weekly words, streak)
✅ Responsive UI design
✅ Entry list with preview

## Next Steps (Phase 2)

- AI integration for prompts and analysis
- Advanced analytics and visualizations
- Theme extraction
- Export functionality

## Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure all Python dependencies are installed

**Frontend errors:**
- Clear browser cache
- Delete node_modules and reinstall
- Check API URL in .env.local

**CORS issues:**
- Verify frontend URL in backend CORS settings
- Check browser console for specific errors 