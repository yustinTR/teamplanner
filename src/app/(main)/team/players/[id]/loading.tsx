import { Skeleton } from "@/components/atoms/Skeleton";

export default function PlayerDetailLoading() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton variant="text" className="h-4 w-16" />
      <div className="flex flex-col items-center gap-3">
        <Skeleton variant="circular" className="size-20" />
        <Skeleton variant="text" className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="h-6 w-16 rounded-full" />
          <Skeleton variant="rectangular" className="h-6 w-12 rounded-full" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-48 w-full rounded-xl" />
    </div>
  );
}
