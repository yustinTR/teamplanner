"use client";

interface AttendanceSummaryProps {
  coming: number;
  notComing: number;
  maybe: number;
}

export function AttendanceSummary({ coming, notComing, maybe }: AttendanceSummaryProps) {
  const total = coming + notComing + maybe;

  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-1.5">
        <div className="size-3 rounded-full bg-success" />
        <span className="text-sm font-medium">{coming}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="size-3 rounded-full bg-danger" />
        <span className="text-sm font-medium">{notComing}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="size-3 rounded-full bg-warning" />
        <span className="text-sm font-medium">{maybe}</span>
      </div>
      <span className="ml-auto text-xs text-muted-foreground">
        {total} reacties
      </span>
    </div>
  );
}
