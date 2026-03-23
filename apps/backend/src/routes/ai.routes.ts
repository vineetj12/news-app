import { Router, Request, Response } from "express";
import { generateSummary, explainNews } from "../services/aiService";

const router = Router();

router.post("/summary", async (req: Request, res: Response) => {
  try {
    console.log("🤖 [AI ROUTES] Summary endpoint called");
    const text = req.body.text || req.body.content;
    console.log("📝 [AI ROUTES] Request body:", { text: text ? text.substring(0, 100) + "..." : "MISSING" });
    
    if (!text) {
      console.log("❌ [AI ROUTES] Text missing - returning 400");
      return res.status(400).json({ 
        message: "Text is required" 
      });
    }

    console.log("🔄 [AI ROUTES] Calling generateSummary...");
    const summary = await generateSummary(text);
    console.log("✅ [AI ROUTES] Summary generated successfully");
    res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ [AI ROUTES] Summary error:", error);
    res.status(500).json({ 
      message: "Failed to generate summary" 
    });
  }
});

router.post("/explain", async (req: Request, res: Response) => {
  try {
    console.log("🤖 [AI ROUTES] Explain endpoint called");
    const text = req.body.text || req.body.content;
    console.log("📝 [AI ROUTES] Request body:", { text: text ? text.substring(0, 100) + "..." : "MISSING" });
    
    if (!text) {
      console.log("❌ [AI ROUTES] Text missing - returning 400");
      return res.status(400).json({ 
        message: "Text is required" 
      });
    }

    console.log("🔄 [AI ROUTES] Calling explainNews...");
    const explanation = await explainNews(text);
    console.log("✅ [AI ROUTES] Explanation generated successfully");
    res.status(200).json({ explanation });
  } catch (error) {
    console.error("❌ [AI ROUTES] Explanation error:", error);
    res.status(500).json({ 
      message: "Failed to generate explanation" 
    });
  }
});

export default router;
