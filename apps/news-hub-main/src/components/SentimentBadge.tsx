import type { Sentiment } from "@/types";

interface SentimentBadgeProps {
  sentiment: Sentiment;
  className?: string;
}

const config: Record<Sentiment, { label: string; className: string }> = {
  positive: {
    label: "Positive",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  negative: {
    label: "Negative",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  neutral: {
    label: "Neutral",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
};

const SentimentBadge = ({ sentiment, className = "" }: SentimentBadgeProps) => {
  const c = config[sentiment];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.className} ${className}`}>
      {c.label}
    </span>
  );
};

export default SentimentBadge;
