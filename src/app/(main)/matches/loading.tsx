import { Skeleton } from "@/components/atoms/Skeleton";

export default function MatchesLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="text" className="h-7 w-32" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton variant="text" className="h-5 w-32" />
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
