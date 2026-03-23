import axios from "axios"
import { STATUS_CODES } from "../statusCodes"
import { Request, Response } from "express"
import prisma from "@repo/db";
import { getTrendingNews, increaseArticleView } from "../services/trendingService";
import { addBookmark, removeBookmark, getUserBookmarks } from "../services/bookmarkService";
import { analyzeSentiment } from "../services/sentimentService";
import { generateSummary, explainNews } from "../services/aiService";
import { mlService } from "../services/mlService";

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "https://newsapi.org/v2";

export const news = async (req: Request, res: Response) => {
  console.log(" [BACKEND] News Request - API Key:", API_KEY ? "SET" : "MISSING");
  console.log(" [BACKEND] Base URL:", BASE_URL);
  
  const response = await axios.get(
    `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`
  );
   res.status(STATUS_CODES.OK).json(response.data.articles);
};

export const newsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  const response = await axios.get(
    `${BASE_URL}/top-headlines?category=${category}&apiKey=${API_KEY}`
  );
   res.status(STATUS_CODES.OK).json(response.data.articles);
};

export const searchNews = async (req: Request, res: Response) => {
  const { query } = req.params;
  const response = await axios.get(
    `${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}`
  );
   res.status(STATUS_CODES.OK).json(response.data.articles);
};

export const trendingNews = async (req: Request, res: Response) => {
  try {
    const trending = await getTrendingNews();
    res.status(STATUS_CODES.OK).json(trending);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending news" });
  }
};

export const bookmarkNews = async (req: Request, res: Response) => {
  try {
    const { userId, articleId } = req.body;
    
    if (!userId || !articleId) {
      return res.status(400).json({ 
        message: "UserId and articleId are required" 
      });
    }

    const bookmark = await addBookmark(userId, articleId);
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Failed to create bookmark" });
  }
};

export const analyzeReliability = async (req: Request, res: Response) => {
  try {
    const { text, source, author } = req.body;
    
    console.log(" [BACKEND] Reliability Analysis Request:");
    console.log(" Text:", text?.substring(0, 100) + "...");
    console.log(" Source:", source);
    console.log(" Author:", author);
    
    if (!text) {
      return res.status(400).json({ 
        message: "Text is required for reliability analysis" 
      });
    }

    console.log(" [BACKEND] Calling ML API for text analysis...");
    const mlResult = await mlService.getReliabilityScore(text);
    console.log(" [BACKEND] ML API Response:", mlResult);
    
    let sourceScore = 5;
    if (source) {
      console.log(" [BACKEND] Calling ML API for source reputation:", source);
      sourceScore = await getSourceReputation(source);
      console.log(" [BACKEND] Source reputation score:", sourceScore);
    }
    
    const enhancedResult = await mlService.calculateEnhancedReliability(
      text,
      sourceScore,
      author ? getAuthorCredibility(author) : 5
    );

    console.log(" [BACKEND] Final Enhanced Result:", enhancedResult);

    res.status(STATUS_CODES.OK).json({
      ...enhancedResult,
      ml_result: mlResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error(" [BACKEND] Reliability analysis error:", error);
    res.status(500).json({ 
      message: "Failed to analyze reliability",
      error: error.message 
    });
  }
};

async function getSourceReputation(source: string): Promise<number> {
  try {
    const mlResult = await mlService.getReliabilityScore(`News from ${source} - reliable journalism source`);
    return mlResult.reliability_score;
  } catch (error) {
    console.error(`Failed to get ML reputation for ${source}:`, error);

    return 5;
  }
}

function getAuthorCredibility(author: string): number {
  if (!author) return 5;

  if (author.includes('Staff') || author.includes('Editor')) {
    return 7;
  }
  if (author.length > 20) { 
    return 6;
  }
  
  return 5;
}