"use client";

interface PlayerMinutesBarProps {
  name: string;
  totalMinutes: number;
  percentage: number;
  totalMatchMinutes: number;
  periods: { start: number; end: number }[];
}

export function PlayerMinutesBar({
  name,
  totalMinutes,
  percentage,
  totalMatchMinutes,
  periods,
}: PlayerMinutesBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate font-medium">{name}</span>
        <span className="shrink-0 text-muted-foreground">
          {totalMinutes} min ({percentage}%)
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        {periods.map((period, i) => {
          const left = (period.start / totalMatchMinutes) * 100;
          const width = ((period.end - period.start) / totalMatchMinutes) * 100;
          return (
            <div
              key={i}
              className="absolute inset-y-0 rounded-full bg-primary"
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
