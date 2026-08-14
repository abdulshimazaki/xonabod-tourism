import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getContentTypeByUrlSlug } from "../../config/contentTypes";
import { useContentList } from "../../hooks/useContent";
import type { TourismItem } from "../../types/content";
import { ListingCard } from "../../components/public/ListingCard";
import { FilterBar } from "../../components/public/FilterBar";
import { EmptyState, Spinner } from "../../components/ui/Misc";
import { MountainDivider } from "../../components/layout/MountainDivider";

export default function ListingPage() {
  const { contentSlug } = useParams();
  const config = contentSlug ? getContentTypeByUrlSlug(contentSlug) : undefined;
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { items, loading } = useContentList<TourismItem>(config?.table ?? "recreation_places", {
    published: true,
    categoryTag: category ?? undefined,
    search: search || undefined,
  });

  const categories = useMemo(() => config?.categoryOptions ?? [], [config]);

  if (!config) {
    return <EmptyState title="Sahifa topilmadi" description="Bunday bo'lim mavjud emas." />;
  }

  return (
    <div>
      <section className="bg-pine-900 pb-16 pt-24 text-center">
        <p className="eyebrow text-gold-100">Xonobod</p>
        <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">{config.pluralLabel}</h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-stone-100/80">{config.description}</p>
      </section>
      <MountainDivider flip />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {categories.length > 0 && (
          <FilterBar categories={categories} active={category} onChange={setCategory} search={search} onSearchChange={setSearch} />
        )}
        {!categories.length && (
          <div className="mb-8 flex justify-end">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nomi bo'yicha qidirish..." className="input max-w-xs" />
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState title="Hozircha bo'sh" description="Bu bo'limda hali obyektlar qo'shilmagan." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ListingCard key={item.id} item={item} urlSlug={config.urlSlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
