import type { PublicLineupPosition } from "@/types/public-team";

interface PublicPitchProps {
  positions: PublicLineupPosition[];
  className?: string;
}

/** Read-only, responsive pitch for the parent view: label circle plus name per position. */
export function PublicPitch({ positions, className }: PublicPitchProps) {
  return (
    <div className={`relative aspect-[68/105] w-full overflow-hidden rounded-lg bg-green-600 ${className ?? ""}`}>
      <div className="absolute inset-2 rounded-md border-2 border-white/40" />
      <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/40" />
      <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
      <div className="absolute inset-x-[20%] top-2 h-[18%] border-2 border-t-0 border-white/40" />
      <div className="absolute inset-x-[20%] bottom-2 h-[18%] border-2 border-b-0 border-white/40" />

      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-white text-xs font-bold text-primary-700 shadow">
            {pos.position_label}
          </div>
          <span className="mt-0.5 max-w-24 truncate rounded bg-black/45 px-1.5 text-[11px] font-semibold text-white">
            {pos.name}
          </span>
        </div>
      ))}
    </div>
  );
}
