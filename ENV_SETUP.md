# Environment Variables Setup Guide

## 📁 Environment Files Structure

```
d:\t\news-app\
├── apps/
│   ├── news-hub-main/          # Frontend
│   │   ├── .env.example        # Frontend env template
│   │   └── .env.local          # Frontend env (create this)
│   ├── backend/                # Backend
│   │   ├── .env.example        # Backend env template
│   │   └── .env                # Backend env (create this)
│   └── ml-api/                 # ML API
│       └── .env.example        # ML API env template (create if needed)
└── packages/
    └── db/
        └── .env                 # Database env (should exist)
```

## 🔧 Frontend Setup (news-hub-main)

1. **Create .env.local file:**
```bash
cd d:/t/news-app/apps/news-hub-main
cp .env.example .env.local
```

2. **Edit .env.local:**
```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# ML API URL (optional - used by backend)
VITE_ML_API_URL=http://localhost:8000
```

## 🔧 Backend Setup (backend)

1. **Create .env file:**
```bash
cd d:/t/news-app/apps/backend
cp .env.example .env
```

2. **Edit .env:**
```env
# ML API URL
ML_API_URL=http://localhost:8000

# Database (from packages/db/.env)
DATABASE_URL="postgresql://user:password@localhost:5432/newsflow"

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here

# News API Key
NEWS_API_KEY=your-news-api-key-here
```

## 🔧 ML API Setup (ml-api) - Optional

1. **Create .env file (if needed):**
```bash
cd d:/t/news-app/apps/ml-api
# Create .env file with port configuration if needed
```

2. **Edit .env:**
```env
# Server port (optional - defaults to 8000)
PORT=8000
```

## 🚀 Usage in Code

### Frontend (Vite):
```typescript
// apiService.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
```

### Backend (Node.js):
```typescript
// mlService.ts
private readonly ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';
```

### ML API (Python):
```python
# main.py
port = int(os.environ.get("PORT", 8000))
```

## ✅ Verification

After setting up environment variables:

1. **Frontend**: Check if API calls work correctly
2. **Backend**: Check if ML API integration works
3. **ML API**: Should start with correct port

## 🔄 Environment-Specific Configurations

### Development:
```env
VITE_API_BASE_URL=http://localhost:3000
ML_API_URL=http://localhost:8000
```

### Production:
```env
VITE_API_BASE_URL=https://api.newsflow.com
ML_API_URL=https://ml-api.newsflow.com
```

## 📝 Notes

- Frontend uses `VITE_` prefix for Vite to expose variables
- Backend uses standard `process.env.VARIABLE_NAME`
- Restart services after changing environment variables
- Never commit actual .env files to git (add to .gitignore)

## 🎯 Quick Start Commands

```bash
# Setup frontend env
cd apps/news-hub-main && cp .env.example .env.local

# Setup backend env  
cd apps/backend && cp .env.example .env

# Start services
cd apps/ml-api && python start.py          # ML API
cd apps/backend && npm run dev              # Backend
cd apps/news-hub-main && npm run dev        # Frontend
```

All services will now use environment variables instead of hardcoded URLs! 🎉
