import { Link } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";

const FALLBACK_IMAGES: Record<string, string> = {
  recreation_places: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?q=80&w=800&auto=format&fit=crop",
  sanatoriums: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop",
  dachas: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=800&auto=format&fit=crop",
  restaurants: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
  accommodations: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  attractions: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800&auto=format&fit=crop",
};

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Bo'limlar</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">Xonabodni qayerdan boshlaymiz?</h2>

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
