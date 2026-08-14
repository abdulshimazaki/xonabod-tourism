import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "../../lib/supabase";
import type { EventItem } from "../../types/content";
import { EmptyState, Spinner } from "../../components/ui/Misc";

export default function EventsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    let query = supabase.from("events").select("*").eq("published", true);
    query = tab === "upcoming" ? query.gte("start_date", today).order("start_date", { ascending: true }) : query.lt("start_date", today).order("start_date", { ascending: false });
    query.then(({ data }) => {
      setEvents((data as EventItem[]) ?? []);
      setLoading(false);
    });
  }, [tab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="eyebrow">Xonobod</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Tadbirlar</h1>

      <div className="mt-8 flex gap-2">
        <button onClick={() => setTab("upcoming")} className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold ${tab === "upcoming" ? "bg-pine text-white" : "border border-stone-200 text-ink-soft"}`}>Bo'lajak</button>
        <button onClick={() => setTab("past")} className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold ${tab === "past" ? "bg-pine text-white" : "border border-stone-200 text-ink-soft"}`}>O'tgan</button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner />
        ) : events.length === 0 ? (
          <EmptyState title="Tadbirlar topilmadi" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <Link key={e.id} to={`/tadbirlar/${e.seo.slug}`} className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <div className="h-44 bg-stone-100">
                  {e.cover_image && <img src={e.cover_image} alt={e.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="eyebrow">{format(new Date(e.start_date), "dd.MM.yyyy")}{e.start_time ? `, ${e.start_time}` : ""}</p>
                  <h3 className="mt-1 font-display text-xl text-pine-600">{e.title}</h3>
                  <p className="mt-1 font-body text-xs text-stone-300">{e.location_text}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
