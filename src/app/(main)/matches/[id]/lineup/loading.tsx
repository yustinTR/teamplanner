import { Skeleton } from "@/components/atoms/Skeleton";

export default function LineupLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="text" className="h-7 w-48" />
      <Skeleton variant="rectangular" className="mx-auto h-[400px] w-full max-w-md rounded-xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-24" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-10 w-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
