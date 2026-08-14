import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getContentTypeByUrlSlug } from "../../config/contentTypes";
import { useContentList, deleteContentItem, togglePublish } from "../../hooks/useContent";
import type { TourismItem } from "../../types/content";
import { EmptyState, Spinner, ConfirmDialog, Toggle, Badge } from "../../components/ui/Misc";
import { useToast } from "../../components/ui/Toast";

export default function ContentListPage() {
  const { contentSlug } = useParams();
  const config = contentSlug ? getContentTypeByUrlSlug(contentSlug) : undefined;
  const { items, loading, refetch } = useContentList<TourismItem>(config?.table ?? "recreation_places");
  const [deleteTarget, setDeleteTarget] = useState<TourismItem | null>(null);
  const { show } = useToast();

  if (!config) return <EmptyState title="Bo'lim topilmadi" />;

  async function handleDelete() {
    if (!deleteTarget || !config) return;
    const { error } = await deleteContentItem(config.table, deleteTarget.id);
    if (error) show(error, "error");
    else show(`"${deleteTarget.name}" o'chirildi.`);
    setDeleteTarget(null);
    refetch();
  }

  async function handlePublishToggle(item: TourismItem) {
    if (!config) return;
    const { error } = await togglePublish(config.table, item.id, !item.published);
    if (error) show(error, "error");
    else show(item.published ? "Nashrdan olindi." : "Nashr qilindi.");
    refetch();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-pine-600">{config.pluralLabel}</h1>
          <p className="mt-1 font-body text-sm text-ink-soft">{items.length} ta obyekt</p>
        </div>
        <Link to={`/admin/${config.urlSlug}/new`} className="btn-primary">{config.addLabel}</Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState
            title="Hozircha obyekt yo'q"
            description="Birinchi obyektni qo'shish uchun tugmani bosing."
            action={<Link to={`/admin/${config.urlSlug}/new`} className="btn-primary">{config.addLabel}</Link>}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-left">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Nomi</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Kategoriya</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Holati</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Tavsiya</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/60">
                    <td className="flex items-center gap-3 px-4 py-3">
                      {item.cover_image ? (
                        <img src={item.cover_image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-stone-100" />
                      )}
                      <span className="font-body text-sm font-medium text-ink">{item.name}</span>
                    </td>
                    <td className="px-4 py-3">{item.category_tag && <Badge tone="stone">{item.category_tag}</Badge>}</td>
                    <td className="px-4 py-3">
                      <Toggle checked={item.published} onChange={() => handlePublishToggle(item)} label={item.published ? "Nashrda" : "Qoralama"} />
                    </td>
                    <td className="px-4 py-3">{item.featured && <Badge tone="gold">Ha</Badge>}</td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <Link to={`/admin/${config.urlSlug}/${item.id}`} className="font-body text-sm font-semibold text-pine hover:underline">
                        Tahrirlash
                      </Link>
                      <button onClick={() => setDeleteTarget(item)} className="font-body text-sm font-semibold text-clay hover:underline">
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`"${deleteTarget?.name}" o'chirilsinmi?`}
        description="Bu amalni ortga qaytarib bo'lmaydi."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
