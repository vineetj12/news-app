import { Sparkles } from "lucide-react";

interface AISummaryBoxProps {
  summary: string;
}

const AISummaryBox = ({ summary }: AISummaryBoxProps) => {
  return (
    <div className="rounded-lg border bg-accent/50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-serif text-sm font-bold text-foreground">AI Summary</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
    </div>
  );
};

export default AISummaryBox;
