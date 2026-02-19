"use client";

import { cn } from "@/lib/utils";
import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface AvatarProps {
  src?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
} as const;

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
} as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, fallback, size = "md", className }: AvatarProps) {
  return (
    <ShadcnAvatar className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback className={textSizeClasses[size]}>
        {getInitials(fallback)}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
