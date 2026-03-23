import { Router, Request, Response } from "express";
import { analyzeSentiment } from "../services/sentimentService";
import { STATUS_CODES } from "../statusCodes";

const router = Router();

router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        message: "Text is required" 
      });
    }

    const sentiment = analyzeSentiment(text);
    res.status(200).json({ sentiment });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to analyze sentiment" 
    });
  }
});

export default router;
