# NewsFlow ML API Setup Guide

## 📁 Current Project Structure

```
d:\t\news-app\
├── apps/                           # Main application folder
│   ├── backend/                  # Node.js backend (Port 3000)
│   ├── ml-api/                   # ML API service (Port 8000)
│   │   ├── main.py               # FastAPI server
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── start.py              # Startup script
│   │   ├── README.md              # API documentation
│   │   └── model/                # ML models
│   │       ├── best_fake_news_model.pkl
│   │       ├── vectorizer.pkl
│   │       ├── Fake.csv
│   │       ├── True.csv
│   │       └── fake_news_model_comparison.ipynb
│   └── news-hub-main/           # React frontend (Port 8080)
├── packages/                      # Shared packages
├── turbo.json                    # Turborepo config
└── package.json                   # Root package.json
```

## 🚀 Quick Start

### 1. Start ML API Service
```bash
cd d:/t/news-app/apps/ml-api
python start.py
```
**Expected output:**
```
🔍 NewsFlow ML API - Startup Check
========================================

📋 Checking Python Version...
✅ Python 3.x+ found

📋 Checking Dependencies...
✅ All dependencies installed

📋 Checking Model Files...
✅ Model files found

========================================
🚀 Starting NewsFlow ML API...
📍 Server will be available at: http://localhost:8000
📖 API docs at: http://localhost:8000/docs
🔍 Health check at: http://localhost:8000/health
```

### 2. Start Backend Service
```bash
cd d:/t/news-app/apps/backend
npm run dev
```

### 3. Start Frontend (Optional - separate terminal)
```bash
cd d:/t/news-app/apps/news-hub-main
npm run dev
```

## 📡 API Endpoints

### ML API (Port 8000)
- **GET** `http://localhost:8000/` - API info
- **GET** `http://localhost:8000/health` - Health check
- **POST** `http://localhost:8000/predict` - Single article analysis
- **POST** `http://localhost:8000/batch-predict` - Batch analysis
- **GET** `http://localhost:8000/docs` - Interactive API docs

### Backend API (Port 3000)
- **POST** `http://localhost:3000/news/analyze-reliability` - Enhanced reliability scoring

### Frontend (Port 8080)
- **GET** `http://localhost:8080/` - NewsFlow application

## 🔗 Integration Flow

```
Frontend (React:8080)
       ↓ User reads article
Node.js Backend (Express:3000)
       ↓ Sends text to ML API
ML API (FastAPI:8000)
       ↓ Analyzes with trained model
       ↓ Returns reliability score
Node.js Backend
       ↓ Combines with source/author factors
Frontend
       ↓ Displays enhanced reliability score
```

## 🧪 Testing the Integration

### Test ML API Directly:
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"text": "Scientists discover new renewable energy source"}'
```

### Test Backend Integration:
```bash
curl -X POST "http://localhost:3000/news/analyze-reliability" \
     -H "Content-Type: application/json" \
     -d '{
       "text": "Scientists discover new renewable energy source",
       "source": "Reuters",
       "author": "Dr. John Smith"
     }'
```

## ✅ Everything is Ready!

All services are properly organized in the `apps/` folder:
- ✅ ML models in `apps/ml-api/model/`
- ✅ ML API in `apps/ml-api/`
- ✅ Backend in `apps/backend/`
- ✅ Frontend in `apps/news-hub-main/`

Start with the commands above and enjoy your ML-powered news reliability system! 🎉
