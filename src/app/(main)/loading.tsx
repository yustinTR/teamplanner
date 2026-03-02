import { Skeleton } from "@/components/atoms/Skeleton";

export default function MainLoading() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-7 w-40" />
        <Skeleton variant="text" className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" className="h-5 w-32" />
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
