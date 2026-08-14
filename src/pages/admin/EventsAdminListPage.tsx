import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useContentList, deleteContentItem, togglePublish } from "../../hooks/useContent";
import type { EventItem } from "../../types/content";
import { EmptyState, Spinner, ConfirmDialog, Toggle } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

export default function EventsAdminListPage() {
  const { items, loading, refetch } = useContentList<EventItem>("events");
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const { show } = useToast();

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await deleteContentItem("events", deleteTarget.id);
    if (error) show(error, "error"); else show(`"${deleteTarget.title}" o'chirildi.`);
    setDeleteTarget(null);
    refetch();
  }

  async function handleToggle(e: EventItem) {
    const { error } = await togglePublish("events", e.id, !e.published);
    if (error) show(error, "error");
    refetch();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-pine-600">Tadbirlar</h1>
        <Link to="/admin/tadbirlar/new" className="btn-primary">+ Yangi tadbir qo'shish</Link>
      </div>

      <div className="mt-6">
        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState title="Tadbirlar yo'q" action={<Link to="/admin/tadbirlar/new" className="btn-primary">+ Yangi tadbir qo'shish</Link>} />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-left">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Nomi</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Sana</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Holati</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-body text-sm font-medium text-ink">{e.title}</td>
                    <td className="px-4 py-3 font-body text-sm text-ink-soft">{format(new Date(e.start_date), "dd.MM.yyyy")}</td>
                    <td className="px-4 py-3"><Toggle checked={e.published} onChange={() => handleToggle(e)} label={e.published ? "Nashrda" : "Qoralama"} /></td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <Link to={`/admin/tadbirlar/${e.id}`} className="font-body text-sm font-semibold text-pine hover:underline">Tahrirlash</Link>
                      <button onClick={() => setDeleteTarget(e)} className="font-body text-sm font-semibold text-clay hover:underline">O'chirish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog open={!!deleteTarget} title={`"${deleteTarget?.title}" o'chirilsinmi?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
