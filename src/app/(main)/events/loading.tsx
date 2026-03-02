import { Skeleton } from "@/components/atoms/Skeleton";

export default function EventsLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton variant="rectangular" className="h-10 w-full rounded-lg" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4">
          <Skeleton variant="text" className="h-5 w-40" />
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-3 w-24" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
