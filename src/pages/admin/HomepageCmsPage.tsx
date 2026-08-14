import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { SiteSettings } from "../../types/content";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { SingleImageUploader } from "../../components/ui/SingleImageUploader";
import { VideoUploader } from "../../components/ui/MediaUploader";
import { Spinner, Toggle } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

export default function HomepageCmsPage() {
  const [form, setForm] = useState<Partial<SiteSettings> | null>(null);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    supabase.from("site_settings").select("*").single().then(({ data }) => setForm((data as SiteSettings) ?? {}));
  }, []);

  if (!form) return <Spinner />;

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...(f ?? {}), [key]: value }));
  }

  function toggleFeaturedCategory(key: string) {
    const current = form!.featured_categories ?? [];
    set("featured_categories", (current.includes(key as never) ? current.filter((c) => c !== key) : [...current, key]) as never);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form!).eq("id", form!.id);
    setSaving(false);
    if (error) show(error.message, "error"); else show("Bosh sahifa yangilandi.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-pine-600">Bosh sahifa</h1>
      <p className="mt-1 font-body text-sm text-ink-soft">Bosh sahifadagi hero, kategoriyalar va boshqa bloklarni shu yerdan boshqaring.</p>

      <div className="mt-6 space-y-8">
        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Hero blok</h2>
          <SingleImageUploader value={form.hero_image ?? null} onChange={(url) => set("hero_image", url)} label="Fon rasmi" folder="hero" />
          <VideoUploader videoUrl={form.hero_video_url ?? null} onChange={(url) => set("hero_video_url", url)} folder="hero" />
          <div>
            <label className="label">Sarlavha</label>
            <input className="input" value={form.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} />
          </div>
          <div>
            <label className="label">Kichik sarlavha</label>
            <input className="input" value={form.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Asosiy tugma matni</label>
              <input className="input" value={form.hero_cta_primary_label ?? ""} onChange={(e) => set("hero_cta_primary_label", e.target.value)} />
            </div>
            <div>
              <label className="label">Ikkinchi tugma matni</label>
              <input className="input" value={form.hero_cta_secondary_label ?? ""} onChange={(e) => set("hero_cta_secondary_label", e.target.value)} />
            </div>
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="font-display text-lg text-pine-600">Ko'rsatiladigan kategoriyalar</h2>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPE_LIST.map((c) => (
              <Toggle key={c.key} checked={(form.featured_categories ?? []).includes(c.key)} onChange={() => toggleFeaturedCategory(c.key)} label={c.navLabel} />
            ))}
          </div>
          <p className="font-body text-xs text-stone-300">
            Tavsiya etilgan aniq joylar, diqqatga sazovor joylar va tadbirlar har bir obyektning tahrirlash sahifasidagi "Tavsiya etilgan" belgisidan boshqariladi.
          </p>
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end border-t border-stone-200 bg-stone-50 py-4">
        <button className="btn-primary" disabled={saving} onClick={handleSave}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </div>
    </div>
  );
}
