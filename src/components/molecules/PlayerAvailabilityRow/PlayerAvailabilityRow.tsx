import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import type { AvailabilityStatus } from "@/types";
import { cn } from "@/lib/utils";

interface PlayerAvailabilityRowProps {
  name: string;
  photoUrl?: string | null;
  status?: AvailabilityStatus | null;
  className?: string;
}

const statusVariantMap: Record<string, "available" | "unavailable" | "maybe"> = {
  available: "available",
  unavailable: "unavailable",
  maybe: "maybe",
};

export function PlayerAvailabilityRow({
  name,
  photoUrl,
  status,
  className,
}: PlayerAvailabilityRowProps) {
  return (
    <div className={cn("flex items-center gap-3 py-2", className)}>
      <Avatar src={photoUrl} fallback={name} size="sm" />
      <span className="flex-1 truncate text-sm">{name}</span>
      {status ? (
        <Badge
          variant={statusVariantMap[status]}
          label={AVAILABILITY_LABELS[status] ?? status}
        />
      ) : (
        <span className="text-xs text-muted-foreground">Geen reactie</span>
      )}
    </div>
  );
}
