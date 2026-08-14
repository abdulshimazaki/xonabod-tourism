import { useEffect, useState } from "react";
import { Hero } from "../../components/public/Hero";
import { CategoryGrid } from "../../components/public/CategoryGrid";
import { SeasonStrip } from "../../components/public/SeasonStrip";
import { MountainDivider } from "../../components/layout/MountainDivider";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { supabase } from "../../lib/supabase";
import type { EventItem, TourismItem } from "../../types/content";
import { ListingCard } from "../../components/public/ListingCard";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function HomePage() {
  const { settings } = useSiteSettings();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [featured, setFeatured] = useState<TourismItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function load() {
      const countEntries = await Promise.all(
        CONTENT_TYPE_LIST.map(async (c) => {
          const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true }).eq("published", true);
          return [c.key, count ?? 0] as const;
        })
      );
      setCounts(Object.fromEntries(countEntries));

      const featuredResults: TourismItem[] = [];
      for (const c of CONTENT_TYPE_LIST) {
        const { data } = await supabase.from(c.table).select("*").eq("published", true).eq("featured", true).limit(3);
        if (data) featuredResults.push(...(data as TourismItem[]));
      }
      setFeatured(featuredResults.slice(0, 6));

      const { data: upcomingEvents } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .gte("start_date", new Date().toISOString().slice(0, 10))
        .order("start_date", { ascending: true })
        .limit(3);
      setEvents((upcomingEvents as EventItem[]) ?? []);
    }
    load();
  }, []);

  return (
    <div>
      <Hero settings={settings} />
      <CategoryGrid counts={counts} />

      {featured.length > 0 && (
        <section className="bg-pine-50/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="eyebrow">Tavsiya etamiz</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Tanlangan joylar</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => {
                const type = CONTENT_TYPE_LIST.find((c) => c.key === item.content_type)!;
                return <ListingCard key={item.id} item={item} urlSlug={type.urlSlug} />;
              })}
            </div>
          </div>
        </section>
      )}

      <SeasonStrip />

      {events.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Yaqinlashib kelayotgan</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Tadbirlar</h2>
            </div>
            <Link to="/tadbirlar" className="font-body text-sm font-semibold text-pine hover:text-gold-600">
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {events.map((e) => (
              <Link key={e.id} to={`/tadbirlar/${e.seo.slug}`} className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="h-40 bg-stone-100">
                  {e.cover_image && <img src={e.cover_image} alt={e.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="eyebrow">{format(new Date(e.start_date), "dd.MM.yyyy")}</p>
                  <h3 className="mt-1 font-display text-lg text-pine-600">{e.title}</h3>
                  <p className="mt-1 font-body text-xs text-stone-300">{e.location_text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <MountainDivider />
      <section className="bg-pine-900 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Xonobod haqida ko'proq bilib oling</h2>
          <p className="mt-3 font-body text-stone-100/80">Tarixi, tabiati, iqlimi va madaniyati bilan tanishing.</p>
          <Link to="/xonobod-haqida" className="btn-gold mt-6 inline-flex">Batafsil</Link>
        </div>
      </section>
    </div>
  );
}
