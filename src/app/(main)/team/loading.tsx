import { Skeleton } from "@/components/atoms/Skeleton";

export default function TeamLoading() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-5 w-20" />
        <Skeleton variant="rectangular" className="h-9 w-28 rounded-lg" />
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton variant="circular" className="size-10" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
          <Skeleton variant="rectangular" className="h-6 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}
