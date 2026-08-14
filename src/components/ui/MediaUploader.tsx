import { useRef, useState, type DragEvent } from "react";
import { useMediaUpload } from "../../hooks/useMediaUpload";
import type { GalleryImage } from "../../types/content";
import { uniqueId } from "../../lib/slug";

type Props = {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  coverUrl: string | null;
  onCoverChange: (url: string | null) => void;
  folder?: string;
  accept?: string;
  label?: string;
};

/**
 * Full gallery manager: drag & drop, multiple upload, progress,
 * reorder (drag handles), delete, and "set as cover image".
 */
export function GalleryUploader({ images, onChange, coverUrl, onCoverChange, folder = "gallery", label = "Galereya" }: Props) {
  const { uploadMany, uploading } = useMediaUpload();
  const [isDragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setErrors([]);
    const files = Array.from(fileList);
    const { results, errors: uploadErrors } = await uploadMany(files, folder);
    if (uploadErrors.length) setErrors(uploadErrors);

    const newImages: GalleryImage[] = results.map((r, i) => ({
      id: uniqueId(),
      url: r.url,
      order: images.length + i,
    }));
    const merged = [...images, ...newImages];
    onChange(merged);
    if (!coverUrl && merged.length > 0) onCoverChange(merged[0].url);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(img: GalleryImage) {
    onChange(images.filter((i) => i.id !== img.id).map((i, idx) => ({ ...i, order: idx })));
    if (coverUrl === img.url) onCoverChange(null);
  }

  function moveImage(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy.map((i, idx) => ({ ...i, order: idx })));
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? "border-gold bg-gold-100/40" : "border-stone-200 bg-stone-50 hover:border-pine-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="font-body text-sm text-ink-soft">
          {uploading ? "Yuklanmoqda..." : "Rasmlarni shu yerga tashlang yoki tanlash uchun bosing"}
        </p>
        <p className="mt-1 font-mono text-xs text-stone-300">JPG, PNG, WEBP — 10 MB gacha</p>
      </div>

      {errors.length > 0 && (
        <ul className="mt-2 space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="font-body text-sm text-clay">{e}</li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl border border-stone-200">
              <img src={img.url} alt={img.alt ?? ""} className="h-28 w-full object-cover" />
              {coverUrl === img.url && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 font-mono text-[10px] text-white">
                  Asosiy
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-1.5 py-1 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => moveImage(idx, -1)} className="text-xs text-white" title="Chapga">←</button>
                <button
                  type="button"
                  onClick={() => onCoverChange(img.url)}
                  className="text-[10px] text-white underline"
                >
                  Asosiy qilish
                </button>
                <button type="button" onClick={() => moveImage(idx, 1)} className="text-xs text-white" title="O'ngga">→</button>
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="text-xs text-white"
                  title="O'chirish"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoUploader({
  videoUrl,
  onChange,
  folder = "videos",
}: {
  videoUrl: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const { uploadFile, uploading } = useMediaUpload();
  const [externalUrl, setExternalUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    const { result, error } = await uploadFile(file, folder);
    if (error) {
      alert(error);
      return;
    }
    if (result) onChange(result.url);
  }

  return (
    <div>
      <span className="label">Video</span>
      {videoUrl ? (
        <div className="space-y-2">
          <video src={videoUrl} controls className="w-full max-w-md rounded-xl" />
          <button type="button" onClick={() => onChange(null)} className="font-body text-sm text-clay underline">
            Videoni olib tashlash
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center hover:border-pine-400"
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <p className="font-body text-sm text-ink-soft">
              {uploading ? "Yuklanmoqda..." : "MP4 yoki WebM video yuklash uchun bosing"}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Yoki YouTube havolasini kiriting"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
            <button type="button" className="btn-secondary shrink-0" onClick={() => externalUrl && onChange(externalUrl)}>
              Qo'shish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
