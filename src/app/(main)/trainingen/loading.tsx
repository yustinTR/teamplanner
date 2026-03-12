import { Skeleton } from "@/components/atoms/Skeleton";

export default function TrainingenLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="text" className="h-7 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
