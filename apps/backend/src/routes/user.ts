import { Router } from "express";
import {
  getUserProfile,
  getUserBookmarks
} from "../controllers/user.controller";

const router = Router();
router.get("/:id", getUserProfile);
router.get("/:id/bookmarks", getUserBookmarks);

export default router;