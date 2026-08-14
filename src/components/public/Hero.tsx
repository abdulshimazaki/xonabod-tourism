import { Link } from "react-router-dom";
import { MountainDivider } from "../layout/MountainDivider";
import type { SiteSettings } from "../../types/content";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const heroImage = settings?.hero_image ?? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop";

  return (
    <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-pine-900">
      {settings?.hero_video_url ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-70">
          <source src={settings.hero_video_url} type="video/mp4" />
        </video>
      ) : (
        <img src={heroImage} alt="Xonabod tabiati" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-900 via-pine-900/40 to-pine-900/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-40 sm:px-6">
        <p className="eyebrow text-gold-100">Andijon viloyati</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-white sm:text-7xl">
          {settings?.hero_title ?? "XONABOD"}
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg text-stone-100/90 sm:text-xl">
          {settings?.hero_subtitle ?? "Tabiat, hordiq va unutilmas taassurotlar"}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/xonabod-haqida" className="btn-gold">
            {settings?.hero_cta_primary_label ?? "Xonabodni kashf eting"}
          </Link>
          <Link to="/dam-olish-maskanlari" className="btn-secondary bg-white/10 text-white hover:bg-white/20 border-white/30">
            {settings?.hero_cta_secondary_label ?? "Dam olish joylarini ko'rish"}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <MountainDivider />
      </div>
    </section>
  );
}
