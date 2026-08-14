import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { supabase } from "../../lib/supabase";
import type { TourismItem } from "../../types/content";
import { ListingCard } from "../../components/public/ListingCard";
import { EmptyState, Spinner } from "../../components/ui/Misc";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<TourismItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    async function search() {
      const all: TourismItem[] = [];
      for (const c of CONTENT_TYPE_LIST) {
        const { data } = await supabase.from(c.table).select("*").eq("published", true).ilike("name", `%${q}%`).limit(12);
        if (data) all.push(...(data as TourismItem[]));
      }
      setResults(all);
      setLoading(false);
    }
    search();
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Qidiruv</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Xonobod bo'ylab qidiring</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input ? { q: input } : {});
        }}
        className="mt-6 flex max-w-xl gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Restoran, mehmonxona, dacha, sanatoriya..."
          className="input"
          autoFocus
        />
        <button type="submit" className="btn-primary shrink-0">Qidirish</button>
      </form>

      <div className="mt-10">
        {loading ? (
          <Spinner />
        ) : !q ? (
          <EmptyState title="Qidiruv so'zini kiriting" description="Masalan: 'Bog'bon dachasi' yoki 'Sanatoriya'" />
        ) : results.length === 0 ? (
          <EmptyState title="Hech narsa topilmadi" description={`"${q}" bo'yicha natija topilmadi.`} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => {
              const cfg = CONTENT_TYPE_LIST.find((c) => c.key === item.content_type)!;
              return <ListingCard key={item.id} item={item} urlSlug={cfg.urlSlug} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
