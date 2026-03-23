import { Router } from "express";
import { bookmarkNews, news, newsByCategory, searchNews, trendingNews, analyzeReliability } from "../controllers/news.controller";

const router = Router();
router.post("/", news);
router.get("/category/:category", newsByCategory);
router.get("/search/:query", searchNews);
router.get("/trending", trendingNews);
router.post("/bookmark", bookmarkNews);
router.post("/analyze-reliability", analyzeReliability);

export default router;