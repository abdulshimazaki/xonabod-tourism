import { useState } from "react";
import { supabase, STORAGE_BUCKET } from "../lib/supabase";
import { uniqueId } from "../lib/slug";

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 200;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export type UploadResult = { url: string; path: string };

function validateFile(file: File): string | null {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return "Faqat JPG, PNG, WEBP rasm yoki MP4, WebM video fayllarni yuklash mumkin.";
  }
  const maxBytes = (isImage ? MAX_IMAGE_MB : MAX_VIDEO_MB) * 1024 * 1024;
  if (file.size > maxBytes) {
    return isImage
      ? `Rasm hajmi ${MAX_IMAGE_MB} MB dan oshmasligi kerak.`
      : `Video hajmi ${MAX_VIDEO_MB} MB dan oshmasligi kerak.`;
  }
  return null;
}

export function useMediaUpload() {
  const [progress] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File, folder = "uploads"): Promise<{ result?: UploadResult; error?: string }> {
    const validationError = validateFile(file);
    if (validationError) return { error: validationError };

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${uniqueId()}.${ext}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    setUploading(false);

    if (error) return { error: error.message };

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return { result: { url: data.publicUrl, path } };
  }

  async function uploadMany(files: File[], folder = "uploads") {
    const results: UploadResult[] = [];
    const errors: string[] = [];
    for (const file of files) {
      const { result, error } = await uploadFile(file, folder);
      if (result) results.push(result);
      if (error) errors.push(`${file.name}: ${error}`);
    }
    return { results, errors };
  }

  async function removeFile(path: string) {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    return { error: error?.message ?? null };
  }

  return { uploadFile, uploadMany, removeFile, progress, uploading };
}
