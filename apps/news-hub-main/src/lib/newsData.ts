import heroImg from "@/assets/hero-news.jpg";
import techImg from "@/assets/news-tech.jpg";
import sportsImg from "@/assets/news-sports.jpg";
import businessImg from "@/assets/news-business.jpg";
import healthImg from "@/assets/news-health.jpg";
import scienceImg from "@/assets/news-science.jpg";

export {
  heroImg,
  techImg,
  sportsImg,
  businessImg,
  healthImg,
  scienceImg
};
export const categoryImages = {
  "All": heroImg,
  "Technology": techImg,
  "Sports": sportsImg,
  "Business": businessImg,
  "Health": healthImg,
  "Science": scienceImg
} as const;

export const getCategoryImage = (category: string) => {
  return categoryImages[category as keyof typeof categoryImages] || heroImg;
};
