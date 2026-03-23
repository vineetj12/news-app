import type { Topic } from "@/types";
export interface User {
  name: string;
  email: string;
}

const KEYS = {
  user: "newsflow_user",
  token: "newsflow_token",
  bookmarks: "newsflow_bookmarks",
  history: "newsflow_history",
};

export const store = {
  getUser: (): User | null => {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: User) => localStorage.setItem(KEYS.user, JSON.stringify(user)),
  getToken: (): string | null => {
    return localStorage.getItem(KEYS.token);
  },
  setToken: (token: string) => localStorage.setItem(KEYS.token, token),
  logout: () => {
    localStorage.removeItem(KEYS.user);
    localStorage.removeItem(KEYS.token);
  },

  // Bookmarks
  getBookmarks: (): string[] => {
    const raw = localStorage.getItem(KEYS.bookmarks);
    return raw ? JSON.parse(raw) : [];
  },
  setBookmarks: (ids: string[]) => localStorage.setItem(KEYS.bookmarks, JSON.stringify(ids)),

  // Reading history
  getHistory: (): string[] => {
    const raw = localStorage.getItem(KEYS.history);
    return raw ? JSON.parse(raw) : [];
  },
  addToHistory: (id: string) => {
    const history = store.getHistory().filter((h) => h !== id);
    history.unshift(id);
    localStorage.setItem(KEYS.history, JSON.stringify(history.slice(0, 50)));
  },

  // Articles management
  getArticles: (): any[] => {
    const raw = localStorage.getItem("newsflow_articles");
    return raw ? JSON.parse(raw) : [];
  },
  setArticles: (articles: any[]) => {
    localStorage.setItem("newsflow_articles", JSON.stringify(articles));
  },
};
