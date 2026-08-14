import { useRef } from "react";
import { useMediaUpload } from "../../hooks/useMediaUpload";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  aspect?: string;
};

export function SingleImageUploader({ value, onChange, folder = "covers", label = "Asosiy rasm", aspect = "aspect-video" }: Props) {
  const { uploadFile, uploading } = useMediaUpload();
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
      <span className="label">{label}</span>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative ${aspect} w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 hover:border-pine-400`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-center">
            <p className="font-body text-sm text-ink-soft">{uploading ? "Yuklanmoqda..." : "Rasm yuklash uchun bosing"}</p>
            <p className="mt-1 font-mono text-xs text-stone-300">JPG, PNG, WEBP — 10 MB gacha</p>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 font-mono text-xs text-white"
          >
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
