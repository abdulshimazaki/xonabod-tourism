import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getContentTypeByUrlSlug } from "../../config/contentTypes";
import { useContentItemBySlug } from "../../hooks/useContent";
import type { TourismItem } from "../../types/content";
import { Spinner, EmptyState, Badge } from "../../components/ui/Misc";
import { Lightbox } from "../../components/ui/Lightbox";
import { MapView } from "../../components/public/MapView";

export default function DetailPage() {
  const { contentSlug, itemSlug } = useParams();
  const config = contentSlug ? getContentTypeByUrlSlug(contentSlug) : undefined;
  const { item, loading } = useContentItemBySlug<TourismItem>(config?.table ?? "recreation_places", itemSlug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!config) return <EmptyState title="Sahifa topilmadi" />;
  if (loading) return <Spinner />;
  if (!item) return <EmptyState title="Obyekt topilmadi" description="Bunday obyekt mavjud emas yoki nashr qilinmagan." />;

  const allImages = item.cover_image
    ? [{ id: "cover", url: item.cover_image, order: -1 }, ...item.gallery]
    : item.gallery;

  return (
    <div>
      <div className="relative h-[52vh] w-full overflow-hidden bg-stone-200">
        {item.cover_image && <img src={item.cover_image} alt={item.name} className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <Link to={`/${config.urlSlug}`} className="font-body text-sm text-stone-100/80 hover:text-white">← {config.pluralLabel}</Link>
          {item.category_tag && (
            <div className="mt-2">
              <Badge tone="gold">{item.category_tag}</Badge>
            </div>
          )}
          <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl">{item.name}</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-body text-lg text-ink-soft">{item.short_description}</p>
          <div
            className="prose prose-pine mt-6 max-w-none font-body"
            dangerouslySetInnerHTML={{ __html: item.description_html }}
          />

          {item.video_url && (
            <div className="mt-8">
              <h2 className="font-display text-2xl text-pine-600">Video</h2>
              <video src={item.video_url} controls className="mt-3 w-full rounded-2xl" />
            </div>
          )}

          {allImages.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-pine-600">Galereya</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {allImages.map((img, idx) => (
                  <button key={img.id} onClick={() => setLightboxIndex(idx)} className="overflow-hidden rounded-xl">
                    <img src={img.url} alt="" className="h-32 w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.amenities.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-pine-600">Qulayliklar</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.amenities.map((a) => <Badge key={a} tone="stone">{a}</Badge>)}
              </div>
            </div>
          )}

          {item.services.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-2xl text-pine-600">Xizmatlar</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.services.map((s) => <Badge key={s} tone="pine">{s}</Badge>)}
              </div>
            </div>
          )}

          {Object.keys(item.extra ?? {}).length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {Object.entries(item.extra).map(([key, value]) =>
                value ? (
                  <div key={key} className="card p-4">
                    <p className="label">{key}</p>
                    <p className="font-body text-ink">{String(value)}</p>
                  </div>
                ) : null
              )}
            </div>
          )}

          {item.coordinates && (
            <div className="mt-10">
              <h2 className="font-display text-2xl text-pine-600">Manzil</h2>
              <div className="mt-4">
                <MapView
                  height="360px"
                  markers={[{
                    id: item.id,
                    name: item.name,
                    coordinates: item.coordinates,
                    image: item.cover_image,
                    phone: item.phone,
                    href: `/${config.urlSlug}/${item.seo.slug}`,
                    color: config.mapColor,
                  }]}
                />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card sticky top-24 space-y-4 p-6">
            {item.address && <InfoRow label="Manzil" value={item.address} />}
            {item.phone && <InfoRow label="Telefon" value={item.phone} href={`tel:${item.phone}`} />}
            {item.working_hours && <InfoRow label="Ish vaqti" value={item.working_hours} />}
            {item.price_info && <InfoRow label="Narx" value={item.price_info} />}
            <div className="flex flex-wrap gap-2 pt-2">
              {item.social.instagram && <SocialButton href={item.social.instagram} label="Instagram" />}
              {item.social.telegram && <SocialButton href={item.social.telegram} label="Telegram" />}
              {item.social.website && <SocialButton href={item.social.website} label="Veb-sayt" />}
              {item.social.booking_url && <SocialButton href={item.social.booking_url} label="Bron qilish" />}
            </div>
            {item.coordinates && (
              <a
                href={`https://www.google.com/maps?q=${item.coordinates.lat},${item.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-2 w-full"
              >
                Yo'nalish olish
              </a>
            )}
          </div>
        </aside>
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={allImages} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      {href ? (
        <a href={href} className="font-body text-ink hover:text-pine">{value}</a>
      ) : (
        <p className="font-body text-ink">{value}</p>
      )}
    </div>
  );
}

function SocialButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="rounded-full border border-stone-200 px-3 py-1.5 font-body text-xs font-medium text-ink-soft hover:border-pine-400 hover:text-pine">
      {label}
    </a>
  );
}
