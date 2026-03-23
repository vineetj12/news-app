import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

const geminiClient = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const GEMINI_MODEL_CANDIDATES = [
  GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite"
].filter((v, i, arr) => arr.indexOf(v) === i);

if (!geminiClient) {
  console.warn("[AI SERVICE] GEMINI_API_KEY is not set; AI endpoints will return fallback responses.");
} else {
  console.log("[AI SERVICE] Gemini client configured.");
}

const callGemini = async (instruction: string, text: string) => {
  if (!geminiClient) {
    return null;
  }

  const prompt = `${instruction}\n\n${text}`;
  let lastError: unknown;

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      const model = geminiClient.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(prompt);
      return response.response.text().trim();
    } catch (error) {
      lastError = error;
      console.warn(`[AI SERVICE] Gemini model failed (${modelName})`);
    }
  }

  throw lastError || new Error("No Gemini model was available for this request.");
};

export const listModels = async () => {
  return [{ id: GEMINI_MODEL, provider: "google-gemini" }];
};

export const generateSummary = async (text: string) => {
  console.log("[AI SERVICE] Summary Request:");
  console.log("Input text:", text.substring(0, 100) + "...");

  if (!geminiClient) {
    console.warn("[AI SERVICE] No Gemini key configured, returning fallback summary.");
    return "AI summary unavailable: check GEMINI_API_KEY in backend .env.";
  }

  try {
    const outputText = await callGemini(
      "Summarize the following news article in 2 short sentences.",
      text
    );

    console.log("[AI SERVICE] Gemini summary output:", (outputText || "").substring(0, 200));
    if (!outputText || outputText.trim() === "") {
      return "AI summary currently unavailable due empty output.";
    }

    return outputText.trim();
  } catch (error: any) {
    console.error("[AI SERVICE] Gemini summary error:", error?.message || error);
    return "AI summary currently unavailable due an upstream API issue.";
  }
};
export const explainNews = async (text: string) => {
  console.log("[AI SERVICE] Explanation Request:");
  console.log("Input text:", text.substring(0, 100) + "...");

  if (!geminiClient) {
    console.warn("[AI SERVICE] No Gemini key configured, returning fallback explanation.");
    return "AI explanation unavailable: check GEMINI_API_KEY in backend .env.";
  }

  try {
    const outputText = await callGemini(
      "Explain this news article in very simple language for beginners.",
      text
    );

    console.log("[AI SERVICE] Gemini explanation output:", (outputText || "").substring(0, 200));
    if (!outputText || outputText.trim() === "") {
      return "AI explanation currently unavailable due empty output.";
    }

    return outputText.trim();
  } catch (error: any) {
    console.error("[AI SERVICE] Gemini explanation error:", error?.message || error);
    return "AI explanation currently unavailable due an upstream API issue.";
  }
};