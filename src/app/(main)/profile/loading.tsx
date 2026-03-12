import { Skeleton } from "@/components/atoms/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col items-center gap-3">
        <Skeleton variant="circular" className="size-20" />
        <Skeleton variant="text" className="h-6 w-40" />
        <Skeleton variant="text" className="h-4 w-48" />
      </div>
      <div className="space-y-3">
        <Skeleton variant="rectangular" className="h-14 w-full rounded-xl" />
        <Skeleton variant="rectangular" className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
