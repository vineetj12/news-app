import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

interface ExplainButtonProps {
  articleTitle: string;
  description: string;
}

const ExplainButton = ({ articleTitle, description }: ExplainButtonProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock simplified explanation
  const explanation = `In simple terms: "${articleTitle}" — ${description} This means changes are coming that could affect everyday life. Experts are watching closely to see how things develop.`;

  return (
    <div>
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
      >
        <Lightbulb className="h-4 w-4 text-primary" />
        {showExplanation ? "Hide Explanation" : "Explain This News"}
      </button>

      {showExplanation && (
        <div className="mt-3 animate-fade-in rounded-lg border border-primary/20 bg-accent/50 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Simplified Explanation</span>
            </div>
            <button
              onClick={() => setShowExplanation(false)}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ExplainButton;
