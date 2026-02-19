import { cn } from "@/lib/utils";

interface AvailabilitySummaryProps {
  available: number;
  unavailable: number;
  maybe: number;
  className?: string;
}

export function AvailabilitySummary({
  available,
  unavailable,
  maybe,
  className,
}: AvailabilitySummaryProps) {
  return (
    <div className={cn("flex items-center gap-3 text-xs", className)}>
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-success" />
        {available}
      </span>
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-danger" />
        {unavailable}
      </span>
      <span className="flex items-center gap-1">
        <span className="size-2 rounded-full bg-warning" />
        {maybe}
      </span>
    </div>
  );
}
