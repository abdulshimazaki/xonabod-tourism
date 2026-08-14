import { useEffect, useState } from "react";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { supabase } from "../../lib/supabase";
import type { TourismItem } from "../../types/content";
import { MapView, type MapMarkerData } from "../../components/public/MapView";
import { Spinner } from "../../components/ui/Misc";

export default function MapPage() {
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(CONTENT_TYPE_LIST.map((c) => c.key)));
  const [items, setItems] = useState<TourismItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all: TourismItem[] = [];
      for (const c of CONTENT_TYPE_LIST) {
        const { data } = await supabase.from(c.table).select("*").eq("published", true).not("coordinates", "is", null);
        if (data) all.push(...(data as TourismItem[]));
      }
      setItems(all);
      setLoading(false);
    }
    load();
  }, []);

  function toggle(key: string) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const markers: MapMarkerData[] = items
    .filter((i) => activeTypes.has(i.content_type) && i.coordinates)
    .map((i) => {
      const cfg = CONTENT_TYPE_LIST.find((c) => c.key === i.content_type)!;
      return {
        id: i.id,
        name: i.name,
        coordinates: i.coordinates!,
        image: i.cover_image,
        phone: i.phone,
        href: `/${cfg.urlSlug}/${i.seo.slug}`,
        color: cfg.mapColor,
      };
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Xonobod</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Interaktiv xarita</h1>
      <p className="mt-2 font-body text-ink-soft">Barcha turizm obyektlarini xaritada toping va filtrlang.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CONTENT_TYPE_LIST.map((c) => (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            className={`rounded-full border px-4 py-2 font-body text-sm font-medium transition ${
              activeTypes.has(c.key) ? "border-pine bg-pine-50 text-pine" : "border-stone-200 text-stone-300"
            }`}
          >
            {c.mapEmoji} {c.navLabel}
          </button>
        ))}
      </div>

      <div className="mt-6">{loading ? <Spinner /> : <MapView markers={markers} height="620px" />}</div>
    </div>
  );
}
