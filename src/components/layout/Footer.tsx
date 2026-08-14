import { Link } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { useSiteSettings } from "../../hooks/useSiteSettings";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="mt-20 bg-pine-900 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <span className="font-display text-xl font-semibold text-white">{settings?.site_name ?? "XONABOD"}</span>
          <p className="mt-3 font-body text-sm text-stone-100/70">
            {settings?.tagline ?? "Tabiat, hordiq va turizm maskani"}
          </p>
        </div>

        <div>
          <p className="eyebrow text-gold-100/80">Bo'limlar</p>
          <ul className="mt-3 space-y-2">
            {CONTENT_TYPE_LIST.map((c) => (
              <li key={c.key}>
                <Link to={`/${c.urlSlug}`} className="font-body text-sm text-stone-100/80 hover:text-white">
                  {c.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold-100/80">Sayt</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/xonabod-haqida" className="font-body text-sm text-stone-100/80 hover:text-white">Xonabod haqida</Link></li>
            <li><Link to="/tadbirlar" className="font-body text-sm text-stone-100/80 hover:text-white">Tadbirlar</Link></li>
            <li><Link to="/media" className="font-body text-sm text-stone-100/80 hover:text-white">Media</Link></li>
            <li><Link to="/xarita" className="font-body text-sm text-stone-100/80 hover:text-white">Interaktiv xarita</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold-100/80">Aloqa</p>
          <ul className="mt-3 space-y-2 font-body text-sm text-stone-100/80">
            {settings?.phone && <li>{settings.phone}</li>}
            {settings?.email && <li>{settings.email}</li>}
            {settings?.address && <li>{settings.address}</li>}
          </ul>
          <div className="mt-4 flex gap-3">
            {settings?.social?.instagram && <a href={settings.social.instagram} className="text-stone-100/70 hover:text-white">Instagram</a>}
            {settings?.social?.telegram && <a href={settings.social.telegram} className="text-stone-100/70 hover:text-white">Telegram</a>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center font-mono text-xs text-stone-100/50 sm:px-6">
        © {new Date().getFullYear()} Xonabod turizm portali. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
