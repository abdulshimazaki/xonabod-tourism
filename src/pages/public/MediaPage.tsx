import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { MediaItem } from "../../types/content";
import { EmptyState, Spinner } from "../../components/ui/Misc";

export default function MediaPage() {
  const [tab, setTab] = useState<"photo" | "video">("photo");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("media")
      .select("*")
      .eq("kind", tab)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setItems((data as MediaItem[]) ?? []);
        setLoading(false);
      });
  }, [tab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Media</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Foto va video</h1>

      <div className="mt-8 flex gap-2">
        <TabButton active={tab === "photo"} onClick={() => setTab("photo")} label="Foto" />
        <TabButton active={tab === "video"} onClick={() => setTab("video")} label="Video" />
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="Hozircha bo'sh" description="Bu bo'limda hali medialar qo'shilmagan." />
        ) : tab === "photo" ? (
          <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
            {items.map((m) => (
              <button key={m.id} onClick={() => setLightboxUrl(m.url)} className="block w-full overflow-hidden rounded-xl">
                <img src={m.url} alt={m.title ?? ""} className="w-full object-cover transition hover:scale-[1.02]" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <div key={m.id} className="card overflow-hidden">
                <video src={m.url} controls poster={m.thumbnail_url ?? undefined} className="aspect-video w-full object-cover" />
                {m.title && <p className="p-3 font-body text-sm font-medium text-ink">{m.title}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4" onClick={() => setLightboxUrl(null)}>
          <img src={lightboxUrl} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold transition ${active ? "bg-pine text-white" : "border border-stone-200 text-ink-soft hover:border-pine-400"}`}
    >
      {label}
    </button>
  );
}
