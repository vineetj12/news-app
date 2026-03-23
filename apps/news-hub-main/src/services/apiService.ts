import axios from "axios";
import { store } from "@/lib/store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = store.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  },
  signin: async (email: string, password: string) => {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
  },
};

export const newsAPI = {
  getNews: async (filters?: any) => {
    const response = await api.post("/news", filters);
    return { articles: response.data };
  },
  getNewsByCategory: async (category: string) => {
    const response = await api.get(`/news/category/${category}`);
    return { articles: response.data };
  },
  searchNews: async (query: string) => {
    const response = await api.get(`/news/search/${query}`);
    return { articles: response.data };
  },
  getTrendingNews: async () => {
    const response = await api.get("/news/trending");
    return { articles: response.data.articles || response.data };
  },
  bookmarkNews: async (articleId: string) => {
    const response = await api.post("/news/bookmark", { articleId });
    return response.data;
  },
};


export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
  getBookmarks: async (userId: string) => {
    const response = await api.get(`/user/${userId}/bookmarks`);
    return response.data;
  },
};


export const sentimentAPI = {
  analyzeSentiment: async (text: string) => {
    const response = await api.post("/sentiment/analyze", { text });
    return response.data;
  },
};

export const aiAPI = {
  generateSummary: async (content: string) => {
    const response = await api.post("/ai/summary", { text: content });
    return response.data;
  },
  explainNews: async (content: string) => {
    const response = await api.post("/ai/explain", { text: content });
    return response.data;
  },
  getRecommendations: async (userId: string) => {
    const response = await api.get(`/ai/recommendations/${userId}`);
    return response.data;
  },
};

export default api;
