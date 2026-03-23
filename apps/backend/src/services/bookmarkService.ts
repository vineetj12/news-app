import { prisma } from "@repo/db";

export const addBookmark = async (userId: string, articleId: string) => {
  console.log("[BOOKMARK SERVICE] addBookmark called", { userId, articleId });
  const result = await prisma.bookmark.create({
    data: {
      userId,
      articleId
    }
  });
  console.log("[BOOKMARK SERVICE] addBookmark result", result);
  return result;
};

export const removeBookmark = async (bookmarkId: string) => {
  console.log("[BOOKMARK SERVICE] removeBookmark called", { bookmarkId });
  const result = await prisma.bookmark.delete({
    where: { id: bookmarkId }
  });
  console.log("[BOOKMARK SERVICE] removeBookmark result", result);
  return result;
};

export const getUserBookmarks = async (userId: string) => {
  console.log("[BOOKMARK SERVICE] getUserBookmarks called", { userId });
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      article: true
    }
  });
  console.log("[BOOKMARK SERVICE] getUserBookmarks result count", bookmarks.length);
  return bookmarks;
};