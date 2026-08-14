import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { supabase } from "../../lib/supabase";
import { Spinner } from "../../components/ui/Misc";

type Stats = Record<string, number> & { events?: number; photo?: number; video?: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({});
  const [recent, setRecent] = useState<{ name: string; table: string; published: boolean; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const entries: Stats = {};
      let recentAll: typeof recent = [];

      for (const c of CONTENT_TYPE_LIST) {
        const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true });
        entries[c.key] = count ?? 0;
        const { data } = await supabase.from(c.table).select("name,published,created_at").order("created_at", { ascending: false }).limit(3);
        if (data) recentAll.push(...data.map((d) => ({ ...d, table: c.navLabel })));
      }
      const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
      const { count: photoCount } = await supabase.from("media").select("*", { count: "exact", head: true }).eq("kind", "photo");
      const { count: videoCount } = await supabase.from("media").select("*", { count: "exact", head: true }).eq("kind", "video");
      entries.events = eventCount ?? 0;
      entries.photo = photoCount ?? 0;
      entries.video = videoCount ?? 0;

      recentAll = recentAll
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);

      setStats(entries);
      setRecent(recentAll);
      setLoading(false);
    }
    load();
  }, []);

  const totalObjects = CONTENT_TYPE_LIST.reduce((sum, c) => sum + (stats[c.key] ?? 0), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-3xl text-pine-600">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-ink-soft">Xonabod turizm portali statistikasi.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Jami obyektlar" value={totalObjects} tone="gold" />
        {CONTENT_TYPE_LIST.map((c) => (
          <StatCard key={c.key} label={c.navLabel} value={stats[c.key] ?? 0} />
        ))}
        <StatCard label="Tadbirlar" value={stats.events ?? 0} />
        <StatCard label="Foto" value={stats.photo ?? 0} />
        <StatCard label="Video" value={stats.video ?? 0} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-xl text-pine-600">So'nggi qo'shilganlar</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {recent.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-body text-sm font-medium text-ink">{r.name}</p>
                  <p className="font-mono text-[11px] text-stone-300">{r.table}</p>
                </div>
                <span className={`font-mono text-[11px] ${r.published ? "text-pine" : "text-stone-300"}`}>
                  {r.published ? "Nashr qilingan" : "Qoralama"}
                </span>
              </li>
            ))}
            {recent.length === 0 && <p className="py-4 font-body text-sm text-stone-300">Hozircha ma'lumot yo'q.</p>}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-xl text-pine-600">Tezkor amallar</h2>
          <div className="mt-4 flex flex-col gap-2">
            {CONTENT_TYPE_LIST.map((c) => (
              <Link key={c.key} to={`/admin/${c.urlSlug}/new`} className="rounded-xl border border-stone-200 px-4 py-2.5 font-body text-sm text-ink-soft hover:border-pine-400 hover:text-pine">
                {c.addLabel}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone = "pine" }: { label: string; value: number; tone?: "pine" | "gold" }) {
  return (
    <div className="card p-4">
      <p className={`font-display text-3xl ${tone === "gold" ? "text-gold-600" : "text-pine-600"}`}>{value}</p>
      <p className="mt-1 font-body text-xs text-ink-soft">{label}</p>
    </div>
  );
}
