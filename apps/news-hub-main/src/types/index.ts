export type Category = "All" | "Technology" | "Sports" | "Business" | "Health" | "Science";
export type Sentiment = "positive" | "negative" | "neutral";
export type Topic = "AI" | "Cricket" | "Startups" | "Crypto" | "Technology" | "Health" | "Space" | "Finance";

export interface Article {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  image: string;
  source: string;
  category: Category;
  date: string;
  trending?: boolean;
  sentiment: Sentiment;
  reliabilityScore: number; // 1-10
  aiSummary: string;
  topics: Topic[];
  originalUrl?: string;
}
