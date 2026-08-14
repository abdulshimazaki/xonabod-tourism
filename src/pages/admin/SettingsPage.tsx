import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { SiteSettings } from "../../types/content";
import { SingleImageUploader } from "../../components/ui/SingleImageUploader";
import { Spinner } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

export default function SettingsPage() {
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
  function setSocial(key: string, value: string) {
    setForm((f) => ({ ...(f ?? {}), social: { ...(f?.social ?? {}), [key]: value } }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form!).eq("id", form!.id);
    setSaving(false);
    if (error) show(error.message, "error"); else show("Sozlamalar saqlandi.");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl text-pine-600">Sozlamalar</h1>

      <div className="mt-6 space-y-8">
        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Sayt ma'lumotlari</h2>
          <div>
            <label className="label">Sayt nomi</label>
            <input className="input" value={form.site_name ?? ""} onChange={(e) => set("site_name", e.target.value)} />
          </div>
          <div>
            <label className="label">Shior</label>
            <input className="input" value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <SingleImageUploader value={form.logo_url ?? null} onChange={(url) => set("logo_url", url)} label="Logotip" folder="settings" aspect="aspect-square" />
          <SingleImageUploader value={form.favicon_url ?? null} onChange={(url) => set("favicon_url", url)} label="Favicon" folder="settings" aspect="aspect-square" />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Aloqa</h2>
          <div><label className="label">Telefon</label><input className="input" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><label className="label">Email</label><input className="input" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div><label className="label">Manzil</label><input className="input" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Ijtimoiy tarmoqlar</h2>
          <div><label className="label">Telegram</label><input className="input" value={form.social?.telegram ?? ""} onChange={(e) => setSocial("telegram", e.target.value)} /></div>
          <div><label className="label">Instagram</label><input className="input" value={form.social?.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} /></div>
          <div><label className="label">Facebook</label><input className="input" value={form.social?.facebook ?? ""} onChange={(e) => setSocial("facebook", e.target.value)} /></div>
          <div><label className="label">YouTube</label><input className="input" value={form.social?.youtube ?? ""} onChange={(e) => setSocial("youtube", e.target.value)} /></div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Standart SEO</h2>
          <div><label className="label">Standart SEO sarlavha</label><input className="input" value={form.seo_default_title ?? ""} onChange={(e) => set("seo_default_title", e.target.value)} /></div>
          <div><label className="label">Standart SEO tavsif</label><textarea className="input" rows={2} value={form.seo_default_description ?? ""} onChange={(e) => set("seo_default_description", e.target.value)} /></div>
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end border-t border-stone-200 bg-stone-50 py-4">
        <button className="btn-primary" disabled={saving} onClick={handleSave}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
      </div>
    </div>
  );
}
