type Props = {
  categories: string[];
  active: string | null;
  onChange: (v: string | null) => void;
  search: string;
  onSearchChange: (v: string) => void;
};

export function FilterBar({ categories, active, onChange, search, onSearchChange }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange(null)}
          className={`rounded-full px-4 py-2 font-body text-sm font-medium transition ${!active ? "bg-pine text-white" : "bg-white text-ink-soft border border-stone-200 hover:border-pine-400"}`}
        >
          Barchasi
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`rounded-full px-4 py-2 font-body text-sm font-medium transition ${active === c ? "bg-pine text-white" : "bg-white text-ink-soft border border-stone-200 hover:border-pine-400"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Nomi bo'yicha qidirish..."
        className="input max-w-xs"
      />
    </div>
  );
}
