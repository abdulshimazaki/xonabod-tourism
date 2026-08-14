import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AboutContent } from "../../types/content";
import { Spinner } from "../../components/ui/Misc";
import { MountainDivider } from "../../components/layout/MountainDivider";

const SECTIONS: { key: keyof AboutContent; label: string }[] = [
  { key: "history_html", label: "Xonabod tarixi" },
  { key: "geography_html", label: "Geografik joylashuvi" },
  { key: "nature_html", label: "Tabiati" },
  { key: "climate_html", label: "Iqlimi" },
  { key: "culture_html", label: "Madaniyati" },
  { key: "tourism_potential_html", label: "Turizm salohiyati" },
];

export default function AboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("about_content").select("*").single().then(({ data }) => {
      setAbout(data as AboutContent);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <section className="relative flex h-[46vh] items-end overflow-hidden bg-pine-900">
        {about?.hero_image && <img src={about.hero_image} alt="Xonabod" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6">
          <p className="eyebrow text-gold-100">Xonabod</p>
          <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">Xonabod haqida</h1>
        </div>
      </section>
      <MountainDivider flip />

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-14 sm:px-6">
        {SECTIONS.map((s) => {
          const html = about?.[s.key] as string | undefined;
          if (!html) return null;
          return (
            <section key={s.key}>
              <h2 className="font-display text-3xl text-pine-600">{s.label}</h2>
              <div className="prose prose-pine mt-4 max-w-none font-body" dangerouslySetInnerHTML={{ __html: html }} />
            </section>
          );
        })}

        {about?.gallery && about.gallery.length > 0 && (
          <section>
            <h2 className="font-display text-3xl text-pine-600">Foto</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {about.gallery.map((img) => (
                <img key={img.id} src={img.url} alt="" className="h-40 w-full rounded-xl object-cover" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
