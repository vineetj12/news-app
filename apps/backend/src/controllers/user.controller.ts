import { Request, Response } from "express";
import { getUserBookmarks as getUserBookmarksService } from "../services/bookmarkService";
import { prisma } from "@repo/db";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBookmarks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bookmarks = await getUserBookmarksService(id);
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};