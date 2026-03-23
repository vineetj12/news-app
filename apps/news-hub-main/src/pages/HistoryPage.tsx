import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, ArrowLeft } from "lucide-react";
import { store } from "@/lib/store";
import { getCategoryImage } from "@/lib/newsData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SentimentBadge from "@/components/SentimentBadge";

const HistoryPage = () => {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const historyIds = store.getHistory();
  const allArticles = store.getArticles(); // Get real articles from store
  const historyArticles = historyIds.map((id) => allArticles.find((a) => a.id === id)).filter(Boolean);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} searchQuery="" onSearch={() => {}} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to news
        </Link>

        <h1 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-foreground">
          <History className="h-6 w-6 text-primary" /> Reading History
        </h1>

        {historyArticles.length === 0 ? (
          <p className="text-muted-foreground">No articles read yet. Start exploring!</p>
        ) : (
          <div className="space-y-3">
            {historyArticles.map((article) => article && (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              >
                <img src={article.image} alt={article.title} className="h-20 w-28 shrink-0 rounded-md object-cover" />
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{article.category}</span>
                    <SentimentBadge sentiment={article.sentiment} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{article.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{article.source} · {article.date}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HistoryPage;
