import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { useContentItemBySlug } from "../../hooks/useContent";
import type { EventItem } from "../../types/content";
import { Spinner, EmptyState } from "../../components/ui/Misc";
import { MapView } from "../../components/public/MapView";

export default function EventDetailPage() {
  const { slug } = useParams();
  const { item: event, loading } = useContentItemBySlug<EventItem>("events", slug);

  if (loading) return <Spinner />;
  if (!event) return <EmptyState title="Tadbir topilmadi" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link to="/tadbirlar" className="font-body text-sm text-ink-soft hover:text-pine">← Tadbirlar</Link>
      {event.cover_image && <img src={event.cover_image} alt={event.title} className="mt-4 h-72 w-full rounded-3xl object-cover" />}
      <p className="eyebrow mt-6">
        {format(new Date(event.start_date), "dd.MM.yyyy")}
        {event.end_date && event.end_date !== event.start_date ? ` – ${format(new Date(event.end_date), "dd.MM.yyyy")}` : ""}
        {event.start_time ? ` · ${event.start_time}${event.end_time ? `–${event.end_time}` : ""}` : ""}
      </p>
      <h1 className="mt-2 font-display text-4xl text-pine-600">{event.title}</h1>
      <p className="mt-2 font-body text-ink-soft">{event.location_text}</p>

      <div className="prose prose-pine mt-6 max-w-none font-body" dangerouslySetInnerHTML={{ __html: event.description_html }} />

      {event.video_url && <video src={event.video_url} controls className="mt-8 w-full rounded-2xl" />}

      {event.gallery.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {event.gallery.map((img) => <img key={img.id} src={img.url} alt="" className="h-32 w-full rounded-xl object-cover" />)}
        </div>
      )}

      {event.coordinates && (
        <div className="mt-8">
          <MapView height="320px" markers={[{ id: event.id, name: event.title, coordinates: event.coordinates, image: event.cover_image, phone: null, href: `/tadbirlar/${event.seo.slug}`, color: "#E08A2B" }]} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {event.registration_url && <a href={event.registration_url} target="_blank" rel="noreferrer" className="btn-primary">Ro'yxatdan o'tish</a>}
        {event.contact_info && <span className="btn-secondary">{event.contact_info}</span>}
      </div>
    </div>
  );
}
