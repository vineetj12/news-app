import { ShieldCheck } from "lucide-react";

interface ReliabilityScoreProps {
  source: string;
  score: number;
  compact?: boolean;
}

const ReliabilityScore = ({ source, score, compact = false }: ReliabilityScoreProps) => {
  const percentage = (score / 10) * 100;
  const color =
    score >= 8
      ? "bg-emerald-500"
      : score >= 5
        ? "bg-amber-500"
        : "bg-red-500";

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>{score}/10</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Source Reliability</span>
        </div>
        <span className="text-sm font-bold text-foreground">{score}/10</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {source} — {score >= 8 ? "Highly reliable" : score >= 5 ? "Moderately reliable" : "Low reliability"}
      </p>
    </div>
  );
};

export default ReliabilityScore;
