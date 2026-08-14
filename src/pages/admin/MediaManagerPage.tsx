import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useMediaUpload } from "../../hooks/useMediaUpload";
import type { MediaItem } from "../../types/content";
import { EmptyState, Spinner, ConfirmDialog } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

export default function MediaManagerPage() {
  const [tab, setTab] = useState<"photo" | "video">("photo");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDragging, setDragging] = useState(false);
  const { uploadMany, uploading } = useMediaUpload();
  const { show } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("media").select("*").eq("kind", tab).order("created_at", { ascending: false });
    setItems((data as MediaItem[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const { results, errors } = await uploadMany(files, "media-center");
    if (errors.length) errors.forEach((e) => show(e, "error"));

    const rows = results.map((r, i) => ({
      kind: files[i].type.startsWith("video") ? "video" : "photo",
      url: r.url,
      thumbnail_url: null,
      title: null,
      description: null,
      category: null,
      is_cover: false,
      related_content_type: null,
      related_content_id: null,
      sort_order: 0,
    }));
    if (rows.length) {
      const { error } = await supabase.from("media").insert(rows);
      if (error) show(error.message, "error");
      else show(`${rows.length} ta fayl yuklandi.`);
    }
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("media").delete().eq("id", deleteTarget.id);
    if (error) show(error.message, "error"); else show("Fayl o'chirildi.");
    setDeleteTarget(null);
    load();
  }

  async function renameItem(item: MediaItem) {
    const title = prompt("Sarlavha kiriting", item.title ?? "");
    if (title === null) return;
    await supabase.from("media").update({ title }).eq("id", item.id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-pine-600">Media kutubxonasi</h1>
      <p className="mt-1 font-body text-sm text-ink-soft">Foto va videolarni bu yerdan yuklang — ular avtomatik ravishda "Media" sahifasida ko'rinadi.</p>

      <div className="mt-6 flex gap-2">
        <TabButton active={tab === "photo"} onClick={() => setTab("photo")} label="Foto" />
        <TabButton active={tab === "video"} onClick={() => setTab("video")} label="Video" />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center ${isDragging ? "border-gold bg-gold-100/40" : "border-stone-200 bg-white hover:border-pine-400"}`}
      >
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <p className="font-body text-sm text-ink-soft">{uploading ? "Yuklanmoqda..." : "Fayllarni shu yerga tashlang yoki tanlash uchun bosing"}</p>
        <p className="mt-1 font-mono text-xs text-stone-300">JPG, PNG, WEBP, MP4, WebM — bir nechta faylni birga tanlashingiz mumkin</p>
      </div>

      <div className="mt-8">
        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState title="Hozircha fayl yo'q" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((m) => (
              <div key={m.id} className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white">
                {m.kind === "photo" ? (
                  <img src={m.url} alt={m.title ?? ""} className="h-32 w-full object-cover" />
                ) : (
                  <video src={m.url} className="h-32 w-full object-cover" />
                )}
                <div className="p-2">
                  <p className="truncate font-body text-xs text-ink">{m.title ?? "(sarlavhasiz)"}</p>
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-ink/50 p-1.5 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => renameItem(m)} className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-[10px]">Nomlash</button>
                  <button onClick={() => setDeleteTarget(m)} className="rounded bg-clay px-1.5 py-0.5 font-mono text-[10px] text-white">O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Fayl o'chirilsinmi?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold ${active ? "bg-pine text-white" : "border border-stone-200 text-ink-soft"}`}>
      {label}
    </button>
  );
}
