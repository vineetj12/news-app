import { useState, useEffect } from "react";
import { newsAPI } from "@/services/apiService";
import { type Article, type Category, type Sentiment, type Topic } from "@/types";
import { articleStore } from "@/lib/articleStore";

const transformArticle = (backendArticle: any, category?: string): Article => {

  if (backendArticle.source && backendArticle.author !== undefined) {

    const urlPath = backendArticle.url || '';
    const cleanId = urlPath
      .replace(/^https?:\/\//, '') 
      .replace(/^[^\/]+\//, '') 
      .replace(/[^a-zA-Z0-9\-_]/g, '-') 
      .substring(0, 50) 
      || `article-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
  
    let fullContent = backendArticle.content || backendArticle.description || '';
   
    fullContent = fullContent.replace(/\s*\[\+\d+\s*chars\]$/, '');
    
 
    let articleCategory = category;
    

    if (!articleCategory) {
      const title = (backendArticle.title || '').toLowerCase();
      const description = (backendArticle.description || '').toLowerCase();
      const content = (title + ' ' + description).toLowerCase();
      
      if (content.includes('sport') || content.includes('football') || content.includes('soccer') || 
          content.includes('cricket') || content.includes('world cup') || content.includes('olympics') ||
          content.includes('game') || content.includes('match') || content.includes('team') ||
          content.includes('player') || content.includes('tournament')) {
        articleCategory = 'Sports';
      } else if (content.includes('business') || content.includes('market') || content.includes('economy') ||
                 content.includes('stock') || content.includes('finance') || content.includes('company') ||
                 content.includes('money') || content.includes('investment') || content.includes('trade')) {
        articleCategory = 'Business';
      } else if (content.includes('health') || content.includes('medical') || content.includes('disease') ||
                 content.includes('cancer') || content.includes('medicine') || content.includes('hospital') ||
                 content.includes('doctor') || content.includes('treatment') || content.includes('drug')) {
        articleCategory = 'Health';
      } else if (content.includes('space') || content.includes('nasa') || content.includes('mars') ||
                 content.includes('moon') || content.includes('rocket') || content.includes('planet') ||
                 content.includes('astronomy') || content.includes('science') || content.includes('research') ||
                 content.includes('study') || content.includes('discovery') || content.includes('quantum')) {
        articleCategory = 'Science';
      } else {
        articleCategory = 'Technology';
      }
    }
    
    console.log(`Article category set to: ${articleCategory} (from param: ${category})`);
    
    return {
      id: cleanId, 
      title: backendArticle.title,
      description: backendArticle.description,
      fullContent: fullContent, 
      image: backendArticle.urlToImage || "/api/placeholder/400/250",
      source: backendArticle.source.name,
      category: articleCategory as Category,
      date: new Date(backendArticle.publishedAt).toLocaleDateString(),
      trending: Math.random() > 0.7, 
      sentiment: "neutral" as Sentiment, 
      reliabilityScore: Math.floor(Math.random() * 3) + 7, 
      aiSummary: "AI-generated summary would appear here...",
      topics: [] as Topic[], 
      originalUrl: backendArticle.url, 
    };
  }
  

  return {
    id: backendArticle.id,
    title: backendArticle.title,
    description: backendArticle.description,
    fullContent: backendArticle.content || backendArticle.description,
    image: backendArticle.imageUrl || "/api/placeholder/400/250",
    source: backendArticle.source,
    category: backendArticle.category as Category,
    date: new Date(backendArticle.publishedAt).toLocaleDateString(),
    trending: Math.random() > 0.7, 
    sentiment: "neutral" as Sentiment, 
    reliabilityScore: Math.floor(Math.random() * 3) + 7, 
    aiSummary: "AI-generated summary would appear here...",
    topics: [] as Topic[], 
  };
};

export const useNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.getNews(filters);
      console.log("Raw API response:", data);
      const transformedArticles = (data.articles || []).map(article => transformArticle(article));
      console.log("Transformed articles:", transformedArticles);
      setArticles(transformedArticles);
      articleStore.setArticles(transformedArticles);
    } catch (err: any) {
      console.error("Fetch news error:", err);
      setError(err.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    console.log(`Fetching category: ${category}`);
    try {
      const data = await newsAPI.getNewsByCategory(category);
      console.log(`Raw API response for category ${category}:`, data);
      const transformedArticles = (data.articles || []).map(article => {
        console.log(`Transforming article with category: ${category}`);
        return transformArticle(article, category);
      });
      console.log(`Transformed articles for category ${category}:`, transformedArticles);
      setArticles(transformedArticles);
      articleStore.setArticles(transformedArticles); 
    } catch (err: any) {
      console.error(`Fetch news by category error for ${category}:`, err);
      setError(err.message || "Failed to fetch news by category");
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async (query: string) => {
    setLoading(true);
    setError(null);
    console.log("Searching for:", query);
    try {
      const data = await newsAPI.searchNews(query);
      console.log("Search API response:", data);
      const transformedArticles = (data.articles || []).map(article => transformArticle(article));
      console.log("Transformed search results:", transformedArticles);
      setArticles(transformedArticles);
      articleStore.setArticles(transformedArticles); // Store articles for article page
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search news");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.getTrendingNews();
      const transformedArticles = (data.articles || []).map(article => transformArticle(article));
      setArticles(transformedArticles);
    } catch (err: any) {
      setError(err.message || "Failed to fetch trending news");
    } finally {
      setLoading(false);
    }
  };

  const bookmarkArticle = async (articleId: string) => {
    try {
      await newsAPI.bookmarkNews(articleId);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to bookmark article");
      return false;
    }
  };

  return {
    articles,
    loading,
    error,
    fetchNews,
    fetchNewsByCategory,
    searchNews,
    fetchTrendingNews,
    bookmarkArticle,
  };
};
