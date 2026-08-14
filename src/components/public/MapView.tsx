import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import type { Coordinates } from "../../types/content";

// Default Leaflet marker icons don't bundle correctly with Vite — point at CDN.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type MapMarkerData = {
  id: string;
  name: string;
  coordinates: Coordinates;
  image: string | null;
  phone: string | null;
  href: string;
  color: string;
};

const XONABOD_CENTER: [number, number] = [40.7386, 72.3184]; // Andijon viloyati atrofi (taxminiy markaz)

export function MapView({ markers, height = "560px" }: { markers: MapMarkerData[]; height?: string }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-3xl border border-stone-200">
      <MapContainer center={XONABOD_CENTER} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> hissa qo\'shuvchilari'}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.coordinates.lat, m.coordinates.lng]} icon={defaultIcon}>
            <Popup>
              <div className="w-40">
                {m.image && <img src={m.image} alt={m.name} className="mb-2 h-20 w-full rounded object-cover" />}
                <p className="font-semibold text-pine-600">{m.name}</p>
                {m.phone && <p className="text-xs text-ink-soft">{m.phone}</p>}
                <Link to={m.href} className="mt-1 inline-block text-xs font-semibold text-gold-600">
                  Batafsil →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
