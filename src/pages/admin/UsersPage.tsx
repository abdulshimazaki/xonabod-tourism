import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AdminUser, UserRole } from "../../types/content";
import { EmptyState, Spinner, Badge } from "../../components/ui/Misc";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/Toast";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Bosh administrator",
  content_manager: "Kontent menejeri",
  editor: "Muharrir",
};

export default function UsersPage() {
  const { adminUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true });
    setUsers((data as AdminUser[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateRole(user: AdminUser, role: UserRole) {
    const { error } = await supabase.from("admin_users").update({ role }).eq("id", user.id);
    if (error) show(error.message, "error"); else show("Rol yangilandi.");
    load();
  }

  const isSuperAdmin = adminUser?.role === "super_admin";

  return (
    <div>
      <h1 className="font-display text-3xl text-pine-600">Foydalanuvchilar</h1>
      <p className="mt-1 font-body text-sm text-ink-soft">
        Yangi administrator qo'shish uchun Supabase konsolida "Authentication → Users" bo'limidan foydalanuvchi yarating, so'ngra unga shu yerdan rol tayinlang.
      </p>

      <div className="mt-6">
        {loading ? <Spinner /> : users.length === 0 ? <EmptyState title="Foydalanuvchilar topilmadi" /> : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-left">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Ism</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Email</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-body text-sm text-ink">{u.full_name || "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-ink-soft">{u.email}</td>
                    <td className="px-4 py-3">
                      {isSuperAdmin ? (
                        <select className="input max-w-[220px]" value={u.role} onChange={(e) => updateRole(u, e.target.value as UserRole)}>
                          {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      ) : (
                        <Badge tone="pine">{ROLE_LABELS[u.role]}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
