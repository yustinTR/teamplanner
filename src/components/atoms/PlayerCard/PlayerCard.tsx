"use client";

import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { CardTier } from "@/lib/player-rating";

// --- Card variant styles ---

const cardVariants = cva(
  "relative flex flex-col items-center overflow-hidden font-bold",
  {
    variants: {
      size: {
        sm: "w-12 rounded-sm",
        md: "w-20 rounded-md",
        lg: "w-40 rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// Tier-specific inline styles for gradient background + text/border colors
const tierInlineStyles: Record<CardTier, React.CSSProperties> = {
  gold: {
    background: "linear-gradient(to bottom, #d4a017, #f5d060, #c8960c)",
    borderColor: "#c8960c",
    color: "#3d2600",
  },
  silver: {
    background: "linear-gradient(to bottom, #8e9aaf, #c8d0dc, #7a8598)",
    borderColor: "#7a8598",
    color: "#1e293b",
  },
  bronze: {
    background: "linear-gradient(to bottom, #a0714f, #cd9b6e, #8b5e3c)",
    borderColor: "#8b5e3c",
    color: "#3d1e00",
  },
};

// --- Shimmer overlay for gold cards ---

function GoldShimmer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <div
        className="absolute -left-full top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        style={{ animation: "shimmer 3s ease-in-out infinite" }}
      />
    </div>
  );
}

// --- Props ---

interface PlayerCardProps extends VariantProps<typeof cardVariants> {
  name: string;
  teamName?: string;
  position: string;
  overall: number;
  photoUrl?: string | null;
  jerseyNumber?: number | null;
  stats?: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number };
  tier?: CardTier;
  className?: string;
}

// --- Component ---

export function PlayerCard({
  name,
  teamName,
  position,
  overall,
  photoUrl,
  stats,
  tier = "bronze",
  size = "md",
  className,
}: PlayerCardProps) {
  if (size === "sm") {
    return <SmallCard name={name} position={position} overall={overall} tier={tier} className={className} />;
  }

  if (size === "md") {
    return (
      <MediumCard
        name={name}
        position={position}
        overall={overall}
        photoUrl={photoUrl}
        tier={tier}
        className={className}
      />
    );
  }

  return (
    <LargeCard
      name={name}
      teamName={teamName}
      position={position}
      overall={overall}
      photoUrl={photoUrl}
      stats={stats}
      tier={tier}
      className={className}
    />
  );
}

// --- Small card (for pitch) ~48x64px ---

function SmallCard({
  name,
  position,
  overall,
  tier,
  className,
}: {
  name: string;
  position: string;
  overall: number;
  tier: CardTier;
  className?: string;
}) {
  return (
    <div
      className={cn(
        cardVariants({ size: "sm" }),
        "border py-0.5 shadow-sm",
        className
      )}
      style={tierInlineStyles[tier]}
    >
      <div className="flex items-baseline gap-0.5">
        <span className="text-[11px] leading-tight">{overall}</span>
      </div>
      <span className="text-[8px] leading-tight opacity-80">{position}</span>
      <span className="mt-auto max-w-full truncate px-0.5 text-[7px] leading-tight opacity-90">
        {name.split(" ").pop()}
      </span>
    </div>
  );
}

// --- Medium card (~80x110px) ---

function MediumCard({
  name,
  position,
  overall,
  photoUrl,
  tier,
  className,
}: {
  name: string;
  position: string;
  overall: number;
  photoUrl?: string | null;
  tier: CardTier;
  className?: string;
}) {
  return (
    <div
      className={cn(
        cardVariants({ size: "md" }),
        "border-2 pb-1.5 pt-1 shadow-md",
        className
      )}
      style={tierInlineStyles[tier]}
    >
      <div className="flex w-full items-baseline justify-between px-1.5">
        <span className="text-lg leading-none">{overall}</span>
        <span className="text-[10px] leading-none opacity-80">{position}</span>
      </div>
      <div className="relative my-1 flex size-10 items-center justify-center overflow-hidden rounded-full bg-black/10">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="40px" />
        ) : (
          <span className="text-sm opacity-60">
            {name.split(" ").map(p => p[0]).join("").slice(0, 2)}
          </span>
        )}
      </div>
      <span className="max-w-full truncate px-1 text-center text-[10px] leading-tight">
        {name}
      </span>
      {tier === "gold" && <GoldShimmer />}
    </div>
  );
}

// --- Large card (~160x220px) ---

function LargeCard({
  name,
  teamName,
  position,
  overall,
  photoUrl,
  stats,
  tier,
  className,
}: {
  name: string;
  teamName?: string;
  position: string;
  overall: number;
  photoUrl?: string | null;
  stats?: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number };
  tier: CardTier;
  className?: string;
}) {
  return (
    <div
      className={cn(
        cardVariants({ size: "lg" }),
        "border-2 pb-2 pt-2 shadow-lg",
        className
      )}
      style={tierInlineStyles[tier]}
    >
      {/* Top: OVR + Position */}
      <div className="flex w-full items-baseline justify-between px-3">
        <span className="text-3xl leading-none">{overall}</span>
        <span className="text-sm leading-none opacity-80">{position}</span>
      </div>

      {/* Photo */}
      <div className="relative my-2 flex size-20 items-center justify-center overflow-hidden rounded-full bg-black/10">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="80px" />
        ) : (
          <span className="text-2xl opacity-50">
            {name.split(" ").map(p => p[0]).join("").slice(0, 2)}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="max-w-full truncate px-2 text-center text-sm leading-tight">
        {name}
      </span>
      {teamName && (
        <span className="max-w-full truncate px-2 text-center text-[10px] leading-tight opacity-70">
          {teamName}
        </span>
      )}

      {/* Stats grid */}
      {stats && (
        <div className="mt-2 grid w-full grid-cols-2 gap-x-3 gap-y-0.5 border-t border-current/20 px-3 pt-1.5 text-[11px]">
          <StatRow label="SNE" value={stats.pac} />
          <StatRow label="SCH" value={stats.sho} />
          <StatRow label="PAS" value={stats.pas} />
          <StatRow label="DRI" value={stats.dri} />
          <StatRow label="VER" value={stats.def} />
          <StatRow label="FYS" value={stats.phy} />
        </div>
      )}
      {tier === "gold" && <GoldShimmer />}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-70">{label}</span>
      <span>{value}</span>
    </div>
  );
}
