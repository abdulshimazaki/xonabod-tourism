import { Link } from "react-router-dom";
import type { TourismItem } from "../../types/content";
import { Badge } from "../ui/Misc";

export function ListingCard({ item, urlSlug }: { item: TourismItem; urlSlug: string }) {
  return (
    <Link to={`/${urlSlug}/${item.seo.slug}`} className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden bg-stone-100">
        {item.cover_image ? (
          <img src={item.cover_image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center font-body text-sm text-stone-300">Rasm yo'q</div>
        )}
        {item.featured && (
          <span className="absolute left-3 top-3">
            <Badge tone="gold">Tavsiya etamiz</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {item.category_tag && <p className="eyebrow">{item.category_tag}</p>}
        <h3 className="mt-1 font-display text-xl text-pine-600 group-hover:text-gold-600">{item.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 font-body text-sm text-ink-soft">{item.short_description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="font-body text-xs text-stone-300">{item.address}</span>
          <span className="font-body text-sm font-semibold text-pine">Batafsil →</span>
        </div>
      </div>
    </Link>
  );
}
