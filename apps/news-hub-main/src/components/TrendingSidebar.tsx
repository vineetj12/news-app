import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "@/types";

interface TrendingSidebarProps {
  articles: Article[];
}

const TrendingSidebar = ({ articles }: TrendingSidebarProps) => {
  return (
    <aside className="rounded-lg border bg-card p-5 card-shadow">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-lg font-bold text-card-foreground">Trending Now</h2>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="group flex gap-3"
          >
            <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {article.source} · {article.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default TrendingSidebar;
