import { Skeleton } from "@/components/atoms/Skeleton";

export default function EventDetailLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="text" className="h-4 w-16" />
      <Skeleton variant="text" className="h-7 w-56" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-40" />
        <Skeleton variant="text" className="h-4 w-32" />
      </div>
      <Skeleton variant="rectangular" className="h-32 w-full rounded-xl" />
      <Skeleton variant="rectangular" className="h-24 w-full rounded-xl" />
    </div>
  );
}
