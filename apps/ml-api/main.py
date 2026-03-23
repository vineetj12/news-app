from fastapi import FastAPI, Request
from fastapi.responses import Response
from pydantic import BaseModel
import joblib
import uvicorn
import os
import time
import json

# Load model and vectorizer from model folder
try:
    model = joblib.load("model/best_fake_news_model.pkl")
    vectorizer = joblib.load("model/vectorizer.pkl")
    print("✅ Model and vectorizer loaded successfully from model/ folder")
except Exception as e:
    print(f" Error loading model: {e}")
    print("Make sure model files are in the 'model/' folder:")
    print("   - model/best_fake_news_model.pkl")
    print("   - model/vectorizer.pkl")
    model = None
    vectorizer = None

app = FastAPI(
    title="NewsFlow ML API",
    description="Fake News Detection API for NewsFlow",
    version="1.0.0"
)

LOG_HTTP = os.environ.get("LOG_HTTP", "true").lower() != "false"
LOG_BODY_LIMIT = int(os.environ.get("LOG_BODY_LIMIT", "1200"))
SENSITIVE_KEYS = {
    "password",
    "token",
    "authorization",
    "apikey",
    "api_key",
    "secret",
    "jwt",
    "accesstoken",
    "refreshToken"
}


def _truncate(value: str, max_chars: int = LOG_BODY_LIMIT) -> str:
    if len(value) <= max_chars:
        return value
    return f"{value[:max_chars]}... [truncated {len(value) - max_chars} chars]"


def _redact(value):
    if isinstance(value, dict):
        out = {}
        for key, inner_value in value.items():
            if str(key).lower() in SENSITIVE_KEYS:
                out[key] = "[REDACTED]"
            else:
                out[key] = _redact(inner_value)
        return out
    if isinstance(value, list):
        return [_redact(item) for item in value]
    return value


def _safe_serialize(value) -> str:
    try:
        return _truncate(json.dumps(_redact(value), ensure_ascii=True))
    except Exception:
        return _truncate(str(value))


@app.middleware("http")
async def log_http_requests(request: Request, call_next):
    if not LOG_HTTP:
        return await call_next(request)

    start = time.time()
    request_id = hex(int(start * 1_000_000))[-8:]

    req_body = None
    try:
        raw = await request.body()
        if raw:
            text = raw.decode("utf-8", errors="replace")
            try:
                req_body = json.loads(text)
            except json.JSONDecodeError:
                req_body = text
    except Exception as exc:
        req_body = f"[unable to read body: {exc}]"

    in_payload = {
        "id": request_id,
        "method": request.method,
        "path": request.url.path,
        "query": dict(request.query_params),
        "client": request.client.host if request.client else None,
        "body": req_body,
    }
    print(f"[ML HTTP IN] {_safe_serialize(in_payload)}")

    response = await call_next(request)
    response_body = b""
    async for chunk in response.body_iterator:
        response_body += chunk

    duration_ms = round((time.time() - start) * 1000, 2)
    decoded_body = response_body.decode("utf-8", errors="replace") if response_body else ""
    try:
        parsed_response = json.loads(decoded_body) if decoded_body else None
    except json.JSONDecodeError:
        parsed_response = decoded_body

    out_payload = {
        "id": request_id,
        "method": request.method,
        "path": request.url.path,
        "status": response.status_code,
        "durationMs": duration_ms,
        "body": parsed_response,
    }
    print(f"[ML HTTP OUT] {_safe_serialize(out_payload)}")

    return Response(
        content=response_body,
        status_code=response.status_code,
        headers=dict(response.headers),
        media_type=response.media_type,
        background=response.background,
    )

class NewsRequest(BaseModel):
    text: str

class NewsResponse(BaseModel):
    prediction: str
    reliability_score: float
    confidence: str

@app.get("/")
def home():
    return {
        "message": "NewsFlow Fake News Detection API running",
        "status": "active",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None
    }

@app.post("/predict", response_model=NewsResponse)
def predict_news(req: NewsRequest):
    if not model or not vectorizer:
        return {
            "prediction": "ERROR",
            "reliability_score": 0.0,
            "confidence": "Model not loaded"
        }
    
    try:
        # Preprocess text
        text = req.text.strip()
        if not text:
            return {
                "prediction": "ERROR",
                "reliability_score": 0.0,
                "confidence": "Empty text provided"
            }
        
        # Vectorize the text
        X = vectorizer.transform([text])
        
        # Make prediction
        prediction = model.predict(X)[0]
        
        # Get probability if available
        prob = None
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(X)[0][1]
        
        # Convert prediction to readable format
        result = "REAL" if prediction == 1 else "FAKE"
        
        # Calculate reliability score (0-10 scale)
        score = round(prob * 10, 2) if prob else 5.0
        
        # Determine confidence level
        if prob:
            if prob >= 0.9:
                confidence = "Very High"
            elif prob >= 0.7:
                confidence = "High"
            elif prob >= 0.5:
                confidence = "Medium"
            else:
                confidence = "Low"
        else:
            confidence = "Unknown"
        
        return {
            "prediction": result,
            "reliability_score": score,
            "confidence": confidence
        }
        
    except Exception as e:
        return {
            "prediction": "ERROR",
            "reliability_score": 0.0,
            "confidence": f"Processing error: {str(e)}"
        }

@app.post("/batch-predict")
def predict_batch_news(requests: list[NewsRequest]):
    if not model or not vectorizer:
        return {"error": "Model not loaded"}
    
    try:
        results = []
        for req in requests:
            text = req.text.strip()
            if text:
                X = vectorizer.transform([text])
                prediction = model.predict(X)[0]
                prob = model.predict_proba(X)[0][1] if hasattr(model, "predict_proba") else None
                
                result = "REAL" if prediction == 1 else "FAKE"
                score = round(prob * 10, 2) if prob else 5.0
                
                results.append({
                    "prediction": result,
                    "reliability_score": score,
                    "text": text[:100] + "..." if len(text) > 100 else text
                })
        
        return {"results": results, "total": len(results)}
        
    except Exception as e:
        return {"error": f"Batch processing error: {str(e)}"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting NewsFlow ML API on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
