import { cn } from "@/lib/utils";

interface MatchScoreProps {
  scoreHome: number | null;
  scoreAway: number | null;
  className?: string;
}

export function MatchScore({ scoreHome, scoreAway, className }: MatchScoreProps) {
  if (scoreHome == null || scoreAway == null) {
    return <span className={cn("text-sm text-muted-foreground", className)}>- : -</span>;
  }

  return (
    <span className={cn("text-lg font-bold tabular-nums", className)}>
      {scoreHome} - {scoreAway}
    </span>
  );
}
