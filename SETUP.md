# Reflect Journal - Setup Guide

This is a comprehensive setup guide to get your Reflect Journal application up and running. The app has both a Next.js frontend and a FastAPI backend.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git

## Environment Setup

### 1. Frontend Environment (.env.local)

Create a `.env.local` file in the root directory with the following:

```bash
# Firebase Configuration (Optional - for Firebase auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Backend Environment (backend/.env)

Create a `backend/.env` file with the following:

```bash
# Database
DATABASE_URL=sqlite:///./journal.db

# Redis (optional for now)
REDIS_URL=redis://localhost:6379

# Security - CHANGE THESE IN PRODUCTION
SECRET_KEY=your_super_secret_key_change_this_in_production_please_make_it_long_and_random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Firebase (optional)
FIREBASE_SERVICE_ACCOUNT_PATH=./keys/service-account.json

# AWS S3 (optional for file uploads)
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# App settings
APP_NAME=Reflective Journal
DEBUG=true
```

## Installation Steps

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be available at http://localhost:3000

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000

## Quick Start (Simplified Authentication)

The app is currently configured to work with a simple username/password authentication system without requiring Firebase. You can:

1. Start both servers (frontend and backend)
2. Navigate to http://localhost:3000
3. Click "Register" to create a new account
4. Use any email and password (minimum 8 characters)
5. After registration, you'll be automatically logged in
6. Start writing journal entries!

## Features

### Working Features
- ✅ User registration and login
- ✅ Create and save journal entries
- ✅ Mood tracking
- ✅ Writing prompts
- ✅ View past entries
- ✅ Basic statistics (entry count, word count, streak)
- ✅ Responsive design

### Planned Features
- 🔄 Advanced insights and analytics
- 🔄 Theme analysis
- 🔄 File attachments
- 🔄 Export functionality
- 🔄 Mobile app

## Database

The app uses SQLite by default, which requires no additional setup. The database file will be created automatically when you first run the backend.

If you want to use PostgreSQL instead, update the `DATABASE_URL` in the backend `.env` file:

```bash
DATABASE_URL=postgresql://username:password@localhost/journal_db
```

## Troubleshooting

### Backend Issues

1. **ImportError: No module named 'jose'**
   ```bash
   cd backend
   pip install python-jose[cryptography]
   ```

2. **Database connection errors**
   - Make sure the DATABASE_URL is correct
   - For SQLite, ensure the directory is writable

3. **CORS errors**
   - Ensure the frontend URL is in the CORS origins in `backend/app/main.py`

### Frontend Issues

1. **API connection errors**
   - Make sure the backend is running on port 8000
   - Check that `NEXT_PUBLIC_API_URL` is set correctly

2. **Build errors**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

### Frontend Development

```bash
npm run dev
```

## Testing the App

1. Register a new account at http://localhost:3000/register
2. Log in with your credentials
3. Try creating a journal entry with different moods
4. Explore the different sections (Today's Entry, Past Entries, Insights)
5. Check that your entries are being saved and displayed correctly

## Next Steps

- Customize the writing prompts in `app/dashboard/page.tsx`
- Add your own styling and branding
- Set up a production database
- Deploy to your preferred hosting platform
- Add Firebase authentication for more robust auth (optional)

## Need Help?

If you encounter any issues:
1. Check that both servers are running
2. Verify your environment variables are set correctly
3. Check the browser console and terminal for error messages
4. Ensure all dependencies are installed

Happy journaling! 🌟 