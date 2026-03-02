import { Skeleton } from "@/components/atoms/Skeleton";

export default function MatchDetailLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-6 w-48" />
        <Skeleton variant="text" className="h-4 w-32" />
      </div>
      <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-5 w-24" />
          <Skeleton variant="text" className="h-5 w-16" />
        </div>
        <Skeleton variant="text" className="h-4 w-40" />
        <Skeleton variant="text" className="h-4 w-36" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-28" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton variant="circular" className="size-8" />
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="rectangular" className="ml-auto h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
