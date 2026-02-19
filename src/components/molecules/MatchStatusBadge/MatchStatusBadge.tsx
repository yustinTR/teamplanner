import { Badge } from "@/components/atoms/Badge";
import { MATCH_STATUS_LABELS } from "@/lib/constants";
import type { MatchStatus } from "@/types";

interface MatchStatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

const statusVariantMap: Record<MatchStatus, "default" | "available" | "unavailable"> = {
  upcoming: "default",
  completed: "available",
  cancelled: "unavailable",
};

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  return (
    <Badge
      variant={statusVariantMap[status]}
      label={MATCH_STATUS_LABELS[status] ?? status}
      className={className}
    />
  );
}
