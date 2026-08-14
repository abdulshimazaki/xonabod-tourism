import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getContentTypeByUrlSlug } from "../../config/contentTypes";
import { useContentItem, createContentItem, updateContentItem } from "../../hooks/useContent";
import type { GalleryImage, TourismItem } from "../../types/content";
import { toSlug } from "../../lib/slug";
import { SingleImageUploader } from "../../components/ui/SingleImageUploader";
import { GalleryUploader, VideoUploader } from "../../components/ui/MediaUploader";
import { RichTextEditor } from "../../components/ui/RichTextEditor";
import { Toggle, Spinner, EmptyState } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

const emptyItem = (): Partial<TourismItem> => ({
  name: "",
  short_description: "",
  description_html: "",
  cover_image: null,
  gallery: [],
  video_url: null,
  address: "",
  coordinates: null,
  phone: "",
  working_hours: "",
  price_info: "",
  amenities: [],
  services: [],
  category_tag: null,
  social: {},
  seo: { slug: "" },
  featured: false,
  published: false,
  sort_order: 0,
  extra: {},
});

export default function ContentFormPage() {
  const { contentSlug, id } = useParams();
  const isNew = id === "new";
  const config = contentSlug ? getContentTypeByUrlSlug(contentSlug) : undefined;
  const navigate = useNavigate();
  const { show } = useToast();

  const { item: existing, loading } = useContentItem<TourismItem>(config?.table ?? "recreation_places", isNew ? undefined : id);

  const [form, setForm] = useState<Partial<TourismItem>>(emptyItem());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [serviceInput, setServiceInput] = useState("");

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  if (!config) return <EmptyState title="Bo'lim topilmadi" />;
  if (!isNew && loading) return <Spinner />;

  function set<K extends keyof TourismItem>(key: K, value: TourismItem[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setExtra(key: string, value: string | number | boolean | null) {
    setForm((f) => ({ ...f, extra: { ...(f.extra ?? {}), [key]: value } }));
  }

  function handleNameChange(name: string) {
    set("name", name);
    if (!slugTouched) {
      set("seo", { ...(form.seo ?? { slug: "" }), slug: toSlug(name) });
    }
  }

  function toggleListValue(field: "amenities" | "services", value: string) {
    const current = form[field] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    set(field, next);
  }

  function addFreeText(field: "amenities" | "services", value: string, clear: () => void) {
    if (!value.trim()) return;
    const current = form[field] ?? [];
    if (!current.includes(value.trim())) set(field, [...current, value.trim()]);
    clear();
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name?.trim()) errs.name = "Iltimos, obyekt nomini kiriting.";
    if (!form.seo?.slug?.trim()) errs.slug = "URL manzili (slug) kiritilishi shart.";
    if (form.phone && !/^[+0-9()\s-]{5,20}$/.test(form.phone)) errs.phone = "Telefon raqami noto'g'ri formatda.";
    if (form.social?.website && !/^https?:\/\//.test(form.social.website)) errs.website = "Veb-sayt manzili https:// bilan boshlanishi kerak.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(publish: boolean) {
    if (!validate() || !config) return;
    setSaving(true);
    const payload: Partial<TourismItem> = { ...form, content_type: config.key, published: publish };

    const result = isNew
      ? await createContentItem<TourismItem>(config.table, payload)
      : await updateContentItem<TourismItem>(config.table, id!, payload);

    setSaving(false);
    if (result.error) {
      show(result.error, "error");
      return;
    }
    show(publish ? "Nashr qilindi." : "Qoralama sifatida saqlandi.");
    navigate(`/admin/${config.urlSlug}`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-pine-600">
          {isNew ? config.addLabel : `Tahrirlash: ${form.name}`}
        </h1>
      </div>

      <div className="mt-6 space-y-8">
        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Asosiy ma'lumot</h2>
          <div>
            <label className="label">Nomi *</label>
            <input className="input" value={form.name ?? ""} onChange={(e) => handleNameChange(e.target.value)} />
            {errors.name && <p className="mt-1 font-body text-xs text-clay">{errors.name}</p>}
          </div>
          <div>
            <label className="label">URL manzili (slug) *</label>
            <input
              className="input"
              value={form.seo?.slug ?? ""}
              onChange={(e) => {
                setSlugTouched(true);
                set("seo", { ...(form.seo ?? { slug: "" }), slug: toSlug(e.target.value) });
              }}
            />
            {errors.slug && <p className="mt-1 font-body text-xs text-clay">{errors.slug}</p>}
          </div>
          {config.categoryOptions && (
            <div>
              <label className="label">Kategoriya</label>
              <select className="input" value={form.category_tag ?? ""} onChange={(e) => set("category_tag", e.target.value || null)}>
                <option value="">Tanlanmagan</option>
                {config.categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="label">Qisqa tavsif</label>
            <textarea className="input" rows={2} value={form.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} />
          </div>
          <div>
            <label className="label">To'liq tavsif</label>
            <RichTextEditor value={form.description_html ?? ""} onChange={(html) => set("description_html", html)} placeholder="Obyekt haqida batafsil yozing..." />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Media</h2>
          <SingleImageUploader value={form.cover_image ?? null} onChange={(url) => set("cover_image", url)} />
          <GalleryUploader
            images={form.gallery ?? []}
            onChange={(g: GalleryImage[]) => set("gallery", g)}
            coverUrl={form.cover_image ?? null}
            onCoverChange={(url) => set("cover_image", url)}
          />
          <VideoUploader videoUrl={form.video_url ?? null} onChange={(url) => set("video_url", url)} />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Joylashuv va aloqa</h2>
          <div>
            <label className="label">Manzil</label>
            <input className="input" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">GPS — Kenglik (lat)</label>
              <input
                className="input"
                type="number"
                step="any"
                value={form.coordinates?.lat ?? ""}
                onChange={(e) => set("coordinates", { lat: parseFloat(e.target.value), lng: form.coordinates?.lng ?? 0 })}
              />
            </div>
            <div>
              <label className="label">GPS — Uzunlik (lng)</label>
              <input
                className="input"
                type="number"
                step="any"
                value={form.coordinates?.lng ?? ""}
                onChange={(e) => set("coordinates", { lat: form.coordinates?.lat ?? 0, lng: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Telefon</label>
              <input className="input" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+998 XX XXX XX XX" />
              {errors.phone && <p className="mt-1 font-body text-xs text-clay">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Ish vaqti</label>
              <input className="input" value={form.working_hours ?? ""} onChange={(e) => set("working_hours", e.target.value)} placeholder="09:00 – 20:00" />
            </div>
          </div>
          <div>
            <label className="label">Narx</label>
            <input className="input" value={form.price_info ?? ""} onChange={(e) => set("price_info", e.target.value)} placeholder="Masalan: 150 000 so'mdan" />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">Ijtimoiy tarmoqlar</h2>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Instagram" value={form.social?.instagram} onChange={(v) => set("social", { ...form.social, instagram: v })} />
            <TextField label="Telegram" value={form.social?.telegram} onChange={(v) => set("social", { ...form.social, telegram: v })} />
            <TextField label="Veb-sayt" value={form.social?.website} onChange={(v) => set("social", { ...form.social, website: v })} error={errors.website} />
            <TextField label="Bron qilish havolasi" value={form.social?.booking_url} onChange={(v) => set("social", { ...form.social, booking_url: v })} />
          </div>
        </section>

        {config.amenityOptions.length > 0 && (
          <section className="card space-y-3 p-6">
            <h2 className="font-display text-lg text-pine-600">Qulayliklar</h2>
            <div className="flex flex-wrap gap-2">
              {config.amenityOptions.map((a) => (
                <CheckChip key={a} label={a} checked={(form.amenities ?? []).includes(a)} onClick={() => toggleListValue("amenities", a)} />
              ))}
            </div>
          </section>
        )}

        <section className="card space-y-3 p-6">
          <h2 className="font-display text-lg text-pine-600">Xizmatlar</h2>
          <div className="flex flex-wrap gap-2">
            {(form.services ?? []).map((s) => (
              <CheckChip key={s} label={s} checked onClick={() => toggleListValue("services", s)} />
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input" placeholder="Yangi xizmat qo'shish" value={serviceInput} onChange={(e) => setServiceInput(e.target.value)} />
            <button type="button" className="btn-secondary shrink-0" onClick={() => addFreeText("services", serviceInput, () => setServiceInput(""))}>
              Qo'shish
            </button>
          </div>
        </section>

        {config.extraFields.length > 0 && (
          <section className="card space-y-4 p-6">
            <h2 className="font-display text-lg text-pine-600">Qo'shimcha ma'lumotlar</h2>
            {config.extraFields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea className="input" rows={3} placeholder={f.placeholder} value={(form.extra?.[f.key] as string) ?? ""} onChange={(e) => setExtra(f.key, e.target.value)} />
                ) : (
                  <input
                    className="input"
                    type={f.type === "number" ? "number" : "text"}
                    placeholder={f.placeholder}
                    value={(form.extra?.[f.key] as string | number) ?? ""}
                    onChange={(e) => setExtra(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                  />
                )}
              </div>
            ))}
          </section>
        )}

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg text-pine-600">SEO</h2>
          <TextField label="SEO sarlavha" value={form.seo?.seo_title} onChange={(v) => set("seo", { ...(form.seo ?? { slug: "" }), seo_title: v })} />
          <div>
            <label className="label">SEO tavsif</label>
            <textarea className="input" rows={2} value={form.seo?.seo_description ?? ""} onChange={(e) => set("seo", { ...(form.seo ?? { slug: "" }), seo_description: e.target.value })} />
          </div>
        </section>

        <section className="card flex flex-wrap items-center gap-6 p-6">
          <Toggle checked={!!form.featured} onChange={(v) => set("featured", v)} label="Tavsiya etilgan (bosh sahifada ko'rsatish)" />
        </section>
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t border-stone-200 bg-stone-50 py-4">
        <button className="btn-secondary" disabled={saving} onClick={() => handleSubmit(false)}>Qoralama sifatida saqlash</button>
        <button className="btn-primary" disabled={saving} onClick={() => handleSubmit(true)}>{saving ? "Saqlanmoqda..." : "Saqlash va nashr qilish"}</button>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, error }: { label: string; value?: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      {error && <p className="mt-1 font-body text-xs text-clay">{error}</p>}
    </div>
  );
}

function CheckChip({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-body text-sm transition ${checked ? "border-pine bg-pine-50 text-pine" : "border-stone-200 text-ink-soft hover:border-pine-400"}`}
    >
      {label}
    </button>
  );
}
