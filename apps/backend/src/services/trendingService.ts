import { prisma } from "@repo/db";

export const getTrendingNews = async () => {
  console.log("[TRENDING SERVICE] getTrendingNews called");
  const trending = await prisma.article.findMany({
    orderBy: {
      views: "desc"
    },
    take: 5
  });

  console.log("[TRENDING SERVICE] getTrendingNews returned", trending.length, "items");
  return trending;
};

export const increaseArticleView = async (articleId: string) => {
  console.log("[TRENDING SERVICE] increaseArticleView called", { articleId });
  const result = await prisma.article.update({
    where: { id: articleId },
    data: {
      views: {
        increment: 1
      }
    }
  });
  console.log("[TRENDING SERVICE] increaseArticleView updated views", result.views);
  return result;
};