"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  playerName: string;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  className?: string;
}

export function PhotoUpload({
  currentPhotoUrl,
  playerName,
  onUpload,
  isUploading,
  className,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (!isUploading) {
      inputRef.current?.click();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset so same file can be re-selected
      e.target.value = "";
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="group relative"
      >
        <Avatar
          src={currentPhotoUrl}
          fallback={playerName}
          size="lg"
          className="size-20"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-white" />
          ) : (
            <Camera className="size-5 text-white" />
          )}
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="size-5 animate-spin text-white" />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <span className="text-xs text-muted-foreground">
        {isUploading ? "Uploaden..." : "Tik om foto te wijzigen"}
      </span>
    </div>
  );
}
