import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AboutContent, GalleryImage } from "../../types/content";
import { RichTextEditor } from "../../components/ui/RichTextEditor";
import { SingleImageUploader } from "../../components/ui/SingleImageUploader";
import { GalleryUploader } from "../../components/ui/MediaUploader";
import { Spinner } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

const SECTIONS: { key: keyof AboutContent; label: string }[] = [
  { key: "history_html", label: "Xonobod tarixi" },
  { key: "geography_html", label: "Geografik joylashuvi" },
  { key: "nature_html", label: "Tabiati" },
  { key: "climate_html", label: "Iqlimi" },
  { key: "culture_html", label: "Madaniyati" },
  { key: "tourism_potential_html", label: "Turizm salohiyati" },
];

export default function AboutEditorPage() {
  const [form, setForm] = useState<Partial<AboutContent> | null>(null);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    supabase.from("about_content").select("*").single().then(({ data }) => setForm((data as AboutContent) ?? {}));
  }, []);

  if (!form) return <Spinner />;

  function set<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setForm((f) => ({ ...(f ?? {}), [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("about_content").update(form!).eq("id", form!.id);
    setSaving(false);
    if (error) show(error.message, "error"); else show("Saqlandi.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-pine-600">Xonobod haqida</h1>
      <p className="mt-1 font-body text-sm text-ink-soft">Bu ma'lumot "Xonobod haqida" ommaviy sahifasida ko'rsatiladi.</p>

      <div className="mt-6 space-y-8">
        <section className="card space-y-4 p-6">
          <SingleImageUploader value={form.hero_image ?? null} onChange={(url) => set("hero_image", url)} label="Sahifa uchun asosiy rasm" folder="about" />
          <GalleryUploader
            images={form.gallery ?? []}
            onChange={(g: GalleryImage[]) => set("gallery", g)}
            coverUrl={null}
            onCoverChange={() => {}}
            folder="about"
            label="Foto galereya"
          />
        </section>

        {SECTIONS.map((s) => (
          <section key={s.key} className="card space-y-3 p-6">
            <h2 className="font-display text-lg text-pine-600">{s.label}</h2>
            <RichTextEditor value={(form[s.key] as string) ?? ""} onChange={(html) => set(s.key, html as never)} />
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end border-t border-stone-200 bg-stone-50 py-4">
        <button className="btn-primary" disabled={saving} onClick={handleSave}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </div>
    </div>
  );
}
