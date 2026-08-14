// Signature content device: Xonobod's tourism appeal genuinely shifts by
// season (bahorda gullash, yozda dam olish, kuzda hosil bayramlari, qishda
// sanatoriy dam olish) — so a season strip encodes real information, unlike
// decorative numbered steps.
const SEASONS = [
  {
    key: "bahor",
    label: "Bahor",
    months: "Mart – May",
    text: "Bog'lar gullaydi, tabiat uyg'onadi — piyoda sayr va fotosurat uchun eng yaxshi fasl.",
    color: "bg-pine-50 text-pine-600",
  },
  {
    key: "yoz",
    label: "Yoz",
    months: "Iyun – Avgust",
    text: "Dam olish maskanlari va dachalarda salqin soyalar ostida hordiq chiqarish fasli.",
    color: "bg-gold-100 text-gold-600",
  },
  {
    key: "kuz",
    label: "Kuz",
    months: "Sentabr – Noyabr",
    text: "Hosil yig'im-terimi va milliy taomlar fasli — restoranlarda mavsumiy taomlarni tating.",
    color: "bg-clay/10 text-clay-600",
  },
  {
    key: "qish",
    label: "Qish",
    months: "Dekabr – Fevral",
    text: "Sanatoriyalarda davolanish va issiq choyxonalarda dam olish uchun qulay fasl.",
    color: "bg-stone-100 text-ink-soft",
  },
];

export function SeasonStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Fasllar bo'yicha</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">Xonobodga qachon tashrif buyurish kerak?</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SEASONS.map((s) => (
          <div key={s.key} className="card p-6">
            <span className={`inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${s.color}`}>
              {s.months}
            </span>
            <h3 className="mt-3 font-display text-2xl text-pine-600">{s.label}</h3>
            <p className="mt-2 font-body text-sm text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
