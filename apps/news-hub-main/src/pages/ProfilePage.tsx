import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Bookmark } from "lucide-react";
import { store } from "@/lib/store";
import { articleStore } from "@/lib/articleStore";
import { type Article } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const [user, setUser] = useState(store.getUser());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const bookmarkIds = store.getBookmarks();
    const articles: Article[] = [];
    
    bookmarkIds.forEach(id => {
      const article = articleStore.getArticle(id);
      if (article) {
        articles.push(article);
      }
    });
    
    setBookmarkedArticles(articles);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} searchQuery="" onSearch={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-muted-foreground">Please sign in to view your profile.</p>
          <Link to="/login" className="mt-4 inline-block text-primary hover:underline">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} searchQuery="" onSearch={() => {}} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* User info */}
        <div className="rounded-lg border bg-card p-6 card-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { store.logout(); navigate("/login"); }}
            className="mt-4 flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        {/* Bookmarked Articles */}
        <div className="mt-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-foreground">Bookmarked Articles</h2>
          {bookmarkedArticles.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No bookmarked articles yet</p>
              <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                Browse articles to bookmark
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="block rounded-lg border bg-card p-4 hover:bg-accent transition-colors"
                >
                  <h3 className="font-serif font-semibold text-foreground mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
