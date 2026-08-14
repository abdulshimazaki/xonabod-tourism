import { useEffect, useState } from "react";
import type { GalleryImage } from "../../types/content";

export function Lightbox({ images, startIndex, onClose }: { images: GalleryImage[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  const img = images[index];
  if (!img) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 font-mono text-2xl text-white/80 hover:text-white">✕</button>
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
        className="absolute left-4 font-mono text-3xl text-white/70 hover:text-white"
      >‹</button>
      <img src={img.url} alt={img.alt ?? ""} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
      <button
        onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
        className="absolute right-4 font-mono text-3xl text-white/70 hover:text-white"
      >›</button>
      <span className="absolute bottom-5 font-mono text-xs text-white/60">{index + 1} / {images.length}</span>
    </div>
  );
}
