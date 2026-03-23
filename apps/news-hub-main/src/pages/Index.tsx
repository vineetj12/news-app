import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import CategoryMenu from "@/components/CategoryMenu";
import NewsCard from "@/components/NewsCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import Footer from "@/components/Footer";
import { useNews } from "@/hooks/useNews";
import { type Article, type Category } from "@/types";
import { store } from "@/lib/store";
import { Loader2 } from "lucide-react";

const BATCH_SIZE = 6;

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(store.getBookmarks()));
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  
  const { articles, loading, error, fetchNews, fetchNewsByCategory, searchNews, bookmarkArticle } = useNews();

  
  const handleCategorySelect = (category: Category) => {
    console.log(`Category selected: ${category}`);
    setActiveCategory(category);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      if (activeCategory === "All") {
        fetchNews();
      } else {
        fetchNewsByCategory(activeCategory);
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchNews(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      store.setBookmarks(Array.from(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    console.log(`Filtering articles. Active category: ${activeCategory}, Total articles: ${articles.length}`);
    const base = articles.filter((a) => {
      const matchesCat = activeCategory === "All" || a.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()));
      console.log(`Article: ${a.title}, Category: ${a.category}, Matches: ${matchesCat}`);
      return matchesCat && matchesSearch;
    });

    console.log(`Filtered articles count: ${base.length}`);
    return base;
  }, [activeCategory, searchQuery, articles]);
  
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [activeCategory, searchQuery]);

  const visibleArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, hasMore, filtered.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const trending = articles.filter((a) => a.trending);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6">
          <CategoryMenu active={activeCategory} onSelect={handleCategorySelect} />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* News grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm">Try adjusting your search or category filters.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {visibleArticles.map((article, i) => (
                    <div
                      key={article.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <NewsCard
                        article={article}
                        bookmarked={bookmarks.has(article.id)}
                        onToggleBookmark={toggleBookmark}
                        featured={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Infinite scroll loader */}
                <div ref={loaderRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                  {!hasMore && filtered.length > BATCH_SIZE && (
                    <p className="text-sm text-muted-foreground">You've reached the end</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-80">
            <div className="sticky top-20 space-y-6">
              <TrendingSidebar articles={trending} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
