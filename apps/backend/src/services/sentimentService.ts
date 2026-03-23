import Sentiment from "sentiment";

const sentiment = new Sentiment();

export const analyzeSentiment = (text: string) => {
  console.log("[SENTIMENT SERVICE] analyzeSentiment called", { textSnippet: text.substring(0, 120) });
  const result = sentiment.analyze(text);
  console.log("[SENTIMENT SERVICE] sentiment score", result.score, "comparative", result.comparative);

  let label = "neutral";
  if (result.score > 0) label = "positive";
  else if (result.score < 0) label = "negative";

  console.log("[SENTIMENT SERVICE] analyzeSentiment result", label);
  return label;
};