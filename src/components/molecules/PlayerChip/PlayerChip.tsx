import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import { DETAILED_POSITION_LABELS } from "@/lib/constants";

interface PlayerChipProps {
  name: string;
  photoUrl?: string | null;
  primaryPosition?: string | null;
  role?: string;
  jerseyNumber?: number | null;
  onClick?: () => void;
  className?: string;
}

export function PlayerChip({
  name,
  photoUrl,
  primaryPosition,
  role,
  jerseyNumber,
  onClick,
  className,
}: PlayerChipProps) {
  const Component = onClick ? "button" : "div";
  const isStaff = role === "staff";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left w-full",
        onClick && "hover:bg-accent/50 transition-colors",
        className
      )}
    >
      <Avatar src={photoUrl} fallback={name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-sm">{name}</span>
          {jerseyNumber != null && (
            <span className="text-xs text-muted-foreground">#{jerseyNumber}</span>
          )}
        </div>
        {isStaff ? (
          <Badge
            variant="default"
            label="Staff"
            className="mt-0.5"
          />
        ) : primaryPosition ? (
          <Badge
            variant="default"
            label={DETAILED_POSITION_LABELS[primaryPosition] ?? primaryPosition}
            className="mt-0.5"
          />
        ) : null}
      </div>
    </Component>
  );
}
