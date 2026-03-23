import axios from 'axios';

interface MLResponse {
  prediction: 'REAL' | 'FAKE' | 'ERROR';
  reliability_score: number;
  confidence: string;
}

interface BatchMLResponse {
  results: Array<{
    prediction: 'REAL' | 'FAKE';
    reliability_score: number;
    text: string;
  }>;
  total: number;
}

class MLService {
  private readonly ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

  async getReliabilityScore(text: string): Promise<MLResponse> {
    try {
      console.log("[ML SERVICE] Sending request to ML API:");
      console.log("Request text:", text.substring(0, 100) + "...");
      console.log("ML API URL:", `${this.ML_API_URL}/predict`);
      
      const response = await axios.post(`${this.ML_API_URL}/predict`, {
        text: text.trim()
      }, {
        timeout: 30000, 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("[ML SERVICE] ML API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[ML SERVICE] ML API Error:", error.message);
      console.log("[ML SERVICE] Using fallback values");
      return {
        prediction: 'ERROR',
        reliability_score: 5.0,
        confidence: 'ML service unavailable'
      };
    }
  }

  async batchReliabilityScores(texts: string[]): Promise<BatchMLResponse> {
    try {
      const requests = texts.map(text => ({ text: text.trim() }));
      
      const response = await axios.post(`${this.ML_API_URL}/batch-predict`, requests, {
        timeout: 30000, 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('ML Batch API Error:', error.message);
      return {
        results: [],
        total: 0
      };
    }
  }

  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
    try {
      const response = await axios.get(`${this.ML_API_URL}/health`, {
        timeout: 10000
      });
      
      return response.data;
    } catch (error: any) {
      console.error('ML Health Check Error:', error.message);
      
      return {
        status: 'unhealthy',
        model_loaded: false
      };
    }
  }
  async calculateEnhancedReliability(
    text: string, 
    sourceReputation: number = 5,
    authorCredibility: number = 5
  ): Promise<{
    mlScore: number;
    finalScore: number;
    prediction: string;
    confidence: string;
    factors: {
      ml: number;
      source: number;
      author: number;
    };
  }> {
    const mlResult = await this.getReliabilityScore(text);
        const weights = {
      ml: 0.6,        // 60% weight to ML model
      source: 0.25,     // 25% weight to source reputation
      author: 0.15       // 15% weight to author credibility
    };
    
    // Calculate final score
    const mlScore = mlResult.reliability_score;
    const finalScore = Math.round(
      (mlScore * weights.ml) + 
      (sourceReputation * weights.source) + 
      (authorCredibility * weights.author)
    );
    
    return {
      mlScore,
      finalScore,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      factors: {
        ml: mlScore,
        source: sourceReputation,
        author: authorCredibility
      }
    };
  }

  // Test connection to ML API
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.status === 'healthy' && health.model_loaded;
    } catch {
      return false;
    }
  }
}

export const mlService = new MLService();
