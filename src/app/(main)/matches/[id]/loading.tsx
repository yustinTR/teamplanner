import { Spinner } from "@/components/atoms/Spinner";

export default function MatchDetailLoading() {
  return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}
