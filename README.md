# News App Monorepo

Production-style news platform built as a Turborepo monorepo with:

- React frontend for the user experience
- Node.js/Express backend for auth, news APIs, AI routes, and orchestration
- Python FastAPI ML service for fake-news reliability inference
- Prisma + PostgreSQL for persistence (users, bookmarks, trending)

This README explains the architecture in detail, especially the ML flow and how services connect.

## 1. Tech Stack

- Monorepo: Turborepo + npm workspaces
- Frontend: React, TypeScript, Vite, Tailwind, shadcn/ui
- Backend: Node.js, Express, TypeScript, JWT auth, Axios
- AI helper routes: Google Gemini (with fallback behavior)
- ML service: FastAPI, scikit-learn, joblib
- Database: Prisma ORM + PostgreSQL

## 2. Monorepo Structure

```text
news-app/
	apps/
		backend/          # Express API (default: :3000)
		ml-api/           # FastAPI ML service (default: :8000)
		news-hub-main/    # React app (default: :8080 in your setup)
	packages/
		db/               # Prisma client and schema
		eslint-config/    # Shared lint config
		typescript-config/# Shared TS config
```

## 3. High-Level Architecture

```text
[React Frontend]
		|
		| HTTP (JWT for protected routes)
		v
[Express Backend]
		|\
		| \--> [NewsAPI.org] (headline/search data)
		| \--> [Gemini API] (summary/explanation)
		|
		| internal HTTP
		v
[FastAPI ML Service]
		|
		v
[scikit-learn model + vectorizer]

[Express Backend] <--> [Prisma + PostgreSQL]
```

## 4. ML Architecture (Detailed)

The ML service lives in `apps/ml-api` and starts from `main.py`.

### 4.1 Model Loading

At startup, the service loads:

- `model/best_fake_news_model.pkl`
- `model/vectorizer.pkl`

If either file is missing, health checks and predictions report degraded state.

### 4.2 Inference Pipeline

For `POST /predict`:

1. Validate input text is present and non-empty.
2. Vectorize with the saved text vectorizer.
3. Predict class with the trained model.
4. If available, compute probability via `predict_proba`.
5. Map class to label:
- `1 -> REAL`
- `0 -> FAKE`
6. Convert probability to `reliability_score` on 0-10 scale:

$$
reliability\_score = round(p \times 10, 2)
$$

If probabilities are unavailable, the service uses a neutral fallback score of `5.0`.

7. Confidence buckets:
- `p >= 0.9`: Very High
- `p >= 0.7`: High
- `p >= 0.5`: Medium
- otherwise: Low

### 4.3 Batch Inference

`POST /batch-predict` accepts multiple texts and returns per-item prediction + score.

### 4.4 Backend Enhanced Reliability Logic

The backend endpoint `POST /news/analyze-reliability` enriches ML output with additional factors.

Final score currently uses weighted blending:

$$
final = round(0.6 \cdot ml + 0.25 \cdot source + 0.15 \cdot author)
$$

Where:

- `ml` comes from ML API reliability score
- `source` is a source reputation proxy
- `author` is a simple heuristic credibility score

This creates a practical hybrid between model-driven and metadata-driven trust scoring.

## 5. Backend API Surface

Base URL: `http://localhost:3000`

Public:

- `GET /` health-style message
- `POST /auth/signup`
- `POST /auth/signin`

JWT-protected groups:

- `/news/*`
	- `POST /news/`
	- `GET /news/category/:category`
	- `GET /news/search/:query`
	- `GET /news/trending`
	- `POST /news/bookmark`
	- `POST /news/analyze-reliability`
- `/sentiment/analyze`
- `/ai/summary`
- `/ai/explain`
- `/user/:id`
- `/user/:id/bookmarks`

Auth middleware expects `Authorization: Bearer <token>`.

## 6. ML API Surface

Base URL: `http://localhost:8000`

- `GET /` service info
- `GET /health` model/vectorizer load status
- `POST /predict` single-text prediction
- `POST /batch-predict` multi-text prediction
- `GET /docs` Swagger UI

## 7. Environment Variables

### 7.1 Frontend (`apps/news-hub-main/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ML_API_URL=http://localhost:8000
```

### 7.2 Backend (`apps/backend/.env`)

```env
PORT=3000
ML_API_URL=http://localhost:8000
DATABASE_URL="postgresql://user:password@localhost:5432/newsflow"
JWT_SECRET=your-jwt-secret
SECRET_KEY=optional-alternative-secret

# News source API
API_KEY=your-newsapi-key
BASE_URL=https://newsapi.org/v2

# AI route support
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash

# Request logging controls
LOG_HTTP=true
LOG_BODY_LIMIT=1200
```

Note: `news.controller.ts` reads `API_KEY` (not `NEWS_API_KEY`), so ensure `API_KEY` is set.

### 7.3 ML API (`apps/ml-api/.env`, optional)

```env
PORT=8000
LOG_HTTP=true
LOG_BODY_LIMIT=1200
```

## 8. Local Development

### 8.1 Prerequisites

- Node.js 18+
- npm 11+
- Python 3.8+
- PostgreSQL

### 8.2 Install Dependencies

From repo root:

```bash
npm install
```

Install Python dependencies:

```bash
cd apps/ml-api
pip install -r requirements.txt
```

### 8.3 Start Services (3 terminals)

Terminal 1 (ML API):

```bash
cd apps/ml-api
python start.py
```

Terminal 2 (Backend):

```bash
cd apps/backend
npm run dev
```

Terminal 3 (Frontend):

```bash
cd apps/news-hub-main
npm run dev
```

### 8.4 Optional Turborepo Commands

From repo root:

```bash
npm run dev
npm run build
npm run lint
npm run check-types
```

## 9. Quick Verification

ML health:

```bash
curl http://localhost:8000/health
```

Backend health:

```bash
curl http://localhost:3000/
```

ML predict sample:

```bash
curl -X POST http://localhost:8000/predict \
	-H "Content-Type: application/json" \
	-d '{"text":"Scientists discover a new renewable energy breakthrough."}'
```

## 10. Common Issues

1. `Model not loaded` from ML API
- Confirm both `.pkl` files exist under `apps/ml-api/model`.

2. Backend returns reliability fallback values
- Ensure ML API is running and `ML_API_URL` is correct.

3. `Unauthorized` on non-auth routes
- Most backend routes require JWT Bearer token.

4. No news results
- Ensure `API_KEY` is configured for NewsAPI.

5. AI summary/explain unavailable
- Set `GEMINI_API_KEY` in backend env.

## 11. Notes for Contributors

- Keep cross-service contracts explicit (backend <-> ml-api payloads).
- If changing reliability math, update both implementation and this README.
- For schema updates, regenerate Prisma client from `packages/db`.
