"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

/**
 * Resize an image file to max dimensions while maintaining aspect ratio
 */
async function resizeImage(file: File, maxSize: number = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not create blob from canvas"));
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };

    img.src = url;
  });
}

export function useUploadPlayerPhoto() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      teamId,
      file,
    }: {
      playerId: string;
      teamId: string;
      file: File;
    }) => {
      // Resize image
      const resized = await resizeImage(file);

      const path = `${teamId}/${playerId}.jpg`;

      // Upload (upsert to replace existing)
      const { error: uploadError } = await supabase.storage
        .from("player-photos")
        .upload(path, resized, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("player-photos")
        .getPublicUrl(path);

      // Add cache buster to force refresh
      const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update player record
      const { error: updateError } = await supabase
        .from("players")
        .update({ photo_url: photoUrl })
        .eq("id", playerId);

      if (updateError) throw updateError;

      return photoUrl;
    },
    onSuccess: (_photoUrl, { playerId, teamId }) => {
      queryClient.invalidateQueries({ queryKey: ["players", teamId] });
      queryClient.invalidateQueries({ queryKey: ["player", playerId] });
    },
  });
}
