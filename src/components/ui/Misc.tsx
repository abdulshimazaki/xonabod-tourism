import { type ReactNode } from "react";

export function Badge({ children, tone = "pine" }: { children: ReactNode; tone?: "pine" | "gold" | "clay" | "stone" }) {
  const tones: Record<string, string> = {
    pine: "bg-pine-50 text-pine-600",
    gold: "bg-gold-100 text-gold-600",
    clay: "bg-clay/10 text-clay-600",
    stone: "bg-stone-100 text-ink-soft",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-stone-50 px-6 py-16 text-center">
      <h3 className="font-display text-xl text-pine-600">{title}</h3>
      {description && <p className="mt-2 max-w-md font-body text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pine-100 border-t-pine" />
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "O'chirish",
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-display text-lg text-pine-600">{title}</h3>
        {description && <p className="mt-2 font-body text-sm text-ink-soft">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">Bekor qilish</button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-6 py-3 font-body font-semibold text-white ${danger ? "bg-clay hover:bg-clay-600" : "bg-pine hover:bg-pine-600"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-pine" : "bg-stone-200"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {label && <span className="font-body text-sm text-ink-soft">{label}</span>}
    </label>
  );
}
