import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "@/types";
import SentimentBadge from "./SentimentBadge";
import ReliabilityScore from "./ReliabilityScore";

interface NewsCardProps {
  article: Article;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  featured?: boolean;
}

const NewsCard = ({ article, bookmarked, onToggleBookmark, featured }: NewsCardProps) => {
  return (
    <article
      className={`group overflow-hidden rounded-lg border bg-card card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-0.5 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : "flex flex-col"
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "md:h-full h-48" : "h-48"}`}>
        <Link to={`/article/${article.id}`}>
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-0.5 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
          {article.category}
        </span>
        <div className="absolute right-3 top-3">
          <SentimentBadge sentiment={article.sentiment} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{article.source}</span>
          <span>{article.date}</span>
        </div>

        <Link to={`/article/${article.id}`}>
          <h3 className={`font-serif font-bold leading-snug text-card-foreground mb-2 hover:text-primary transition-colors ${featured ? "text-xl" : "text-base"}`}>
            {article.title}
          </h3>
        </Link>

        <p className="mb-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.description}
        </p>

        {/* Reliability */}
        <div className="mb-3">
          <ReliabilityScore source={article.source} score={article.reliabilityScore} compact />
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/article/${article.id}`}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Read more <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`rounded-full p-2 transition-colors ${
              bookmarked
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
