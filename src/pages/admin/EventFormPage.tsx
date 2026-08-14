import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContentItem, createContentItem, updateContentItem } from "../../hooks/useContent";
import type { EventItem, GalleryImage } from "../../types/content";
import { toSlug } from "../../lib/slug";
import { SingleImageUploader } from "../../components/ui/SingleImageUploader";
import { GalleryUploader, VideoUploader } from "../../components/ui/MediaUploader";
import { RichTextEditor } from "../../components/ui/RichTextEditor";
import { Spinner } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

const emptyEvent = (): Partial<EventItem> => ({
  title: "", cover_image: null, gallery: [], video_url: null, description_html: "",
  start_date: new Date().toISOString().slice(0, 10), end_date: null, start_time: null, end_time: null,
  location_text: "", coordinates: null, registration_url: null, contact_info: null,
  published: false, seo: { slug: "" },
});

export default function EventFormPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { show } = useToast();
  const { item: existing, loading } = useContentItem<EventItem>("events", isNew ? undefined : id);
  const [form, setForm] = useState<Partial<EventItem>>(emptyEvent());
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (existing) setForm(existing); }, [existing]);
  if (!isNew && loading) return <Spinner />;

  function set<K extends keyof EventItem>(key: K, value: EventItem[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.title?.trim()) errs.title = "Iltimos, tadbir nomini kiriting.";
    if (!form.start_date) errs.start_date = "Boshlanish sanasini kiriting.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(publish: boolean) {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, published: publish };
    const result = isNew
      ? await createContentItem<EventItem>("events", payload)
      : await updateContentItem<EventItem>("events", id!, payload);
    setSaving(false);
    if (result.error) { show(result.error, "error"); return; }
    show(publish ? "Tadbir nashr qilindi." : "Qoralama saqlandi.");
    navigate("/admin/tadbirlar");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl text-pine-600">{isNew ? "Yangi tadbir qo'shish" : `Tahrirlash: ${form.title}`}</h1>

      <div className="mt-6 space-y-8">
        <section className="card space-y-4 p-6">
          <div>
            <label className="label">Tadbir nomi *</label>
            <input className="input" value={form.title ?? ""} onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("seo", { slug: toSlug(e.target.value) });
            }} />
            {errors.title && <p className="mt-1 font-body text-xs text-clay">{errors.title}</p>}
          </div>
          <div>
            <label className="label">URL manzili (slug)</label>
            <input className="input" value={form.seo?.slug ?? ""} onChange={(e) => { setSlugTouched(true); set("seo", { slug: toSlug(e.target.value) }); }} />
          </div>
          <div>
            <label className="label">Tavsif</label>
            <RichTextEditor value={form.description_html ?? ""} onChange={(html) => set("description_html", html)} />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Media</h2>
          <SingleImageUploader value={form.cover_image ?? null} onChange={(url) => set("cover_image", url)} folder="events" />
          <GalleryUploader images={form.gallery ?? []} onChange={(g: GalleryImage[]) => set("gallery", g)} coverUrl={form.cover_image ?? null} onCoverChange={(url) => set("cover_image", url)} folder="events" />
          <VideoUploader videoUrl={form.video_url ?? null} onChange={(url) => set("video_url", url)} folder="events" />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Sana va joylashuv</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Boshlanish sanasi *</label>
              <input type="date" className="input" value={form.start_date ?? ""} onChange={(e) => set("start_date", e.target.value)} />
              {errors.start_date && <p className="mt-1 font-body text-xs text-clay">{errors.start_date}</p>}
            </div>
            <div>
              <label className="label">Tugash sanasi</label>
              <input type="date" className="input" value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value || null)} />
            </div>
            <div>
              <label className="label">Boshlanish vaqti</label>
              <input type="time" className="input" value={form.start_time ?? ""} onChange={(e) => set("start_time", e.target.value || null)} />
            </div>
            <div>
              <label className="label">Tugash vaqti</label>
              <input type="time" className="input" value={form.end_time ?? ""} onChange={(e) => set("end_time", e.target.value || null)} />
            </div>
          </div>
          <div>
            <label className="label">Joylashuv</label>
            <input className="input" value={form.location_text ?? ""} onChange={(e) => set("location_text", e.target.value)} />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Ro'yxatdan o'tish va aloqa</h2>
          <div>
            <label className="label">Ro'yxatdan o'tish havolasi</label>
            <input className="input" value={form.registration_url ?? ""} onChange={(e) => set("registration_url", e.target.value || null)} />
          </div>
          <div>
            <label className="label">Aloqa ma'lumoti</label>
            <input className="input" value={form.contact_info ?? ""} onChange={(e) => set("contact_info", e.target.value || null)} />
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t border-stone-200 bg-stone-50 py-4">
        <button className="btn-secondary" disabled={saving} onClick={() => handleSubmit(false)}>Qoralama saqlash</button>
        <button className="btn-primary" disabled={saving} onClick={() => handleSubmit(true)}>Saqlash va nashr qilish</button>
      </div>
    </div>
  );
}
