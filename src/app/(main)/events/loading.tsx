import { Spinner } from "@/components/atoms/Spinner";

export default function EventsLoading() {
  return (
    <div className="flex justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
