import { Link } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";

const FALLBACK_IMAGES: Record<string, string> = {
  recreation_places: "https://gjianimaiawdnyxovwvp.supabase.co/storage/v1/object/public/xonobod-media/media-center/953378ed-8557-4f28-bb69-e0d5d376e55d.png",
  sanatoriums: "https://gjianimaiawdnyxovwvp.supabase.co/storage/v1/object/public/xonobod-media/media-center/b927e85b-b522-49d3-991d-436de0c07744.jpg",
  dachas: "https://gjianimaiawdnyxovwvp.supabase.co/storage/v1/object/public/xonobod-media/media-center/4eb5dda1-a822-4387-b207-b7364f881ee1.jpg",
  restaurants: "https://gjianimaiawdnyxovwvp.supabase.co/storage/v1/object/public/xonobod-media/media-center/91c26f63-162a-4cf6-85a7-25da8cc3ba94.png",
  accommodations: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  attractions: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800&auto=format&fit=crop",
};

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Bo'limlar</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">Xonobodni qayerdan boshlaymiz?</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_TYPE_LIST.map((c) => (
          <Link
            key={c.key}
            to={`/${c.urlSlug}`}
            className="card group relative overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={FALLBACK_IMAGES[c.key]}
                alt={c.navLabel}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <span className="absolute bottom-3 left-4 font-display text-xl text-white">{c.navLabel}</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <p className="font-body text-sm text-ink-soft">{c.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3">
              <span className="font-mono text-xs text-stone-300">{counts[c.key] ?? 0} ta joy</span>
              <span className="font-body text-sm font-semibold text-pine group-hover:text-gold-600">Batafsil →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
