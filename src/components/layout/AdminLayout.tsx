import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";
import { useAuth } from "../../hooks/useAuth";

const EXTRA_LINKS = [
  { to: "/admin/tadbirlar", label: "Tadbirlar", icon: "🗓" },
  { to: "/admin/media", label: "Foto / Video", icon: "🖼" },
  { to: "/admin/xonabod-haqida", label: "Xonabod haqida", icon: "📖" },
  { to: "/admin/bosh-sahifa", label: "Bosh sahifa", icon: "🏠" },
  { to: "/admin/sozlamalar", label: "Sozlamalar", icon: "⚙️" },
  { to: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: "👥" },
];

export function AdminLayout() {
  const { adminUser, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="px-6 py-5">
          <span className="font-display text-xl font-semibold text-pine-600">XONABOD</span>
          <p className="font-mono text-[11px] uppercase tracking-wide text-gold-600">Admin panel</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          <SidebarLink to="/admin" label="Dashboard" icon="📊" end />
          <p className="mt-4 px-3 pb-1 font-mono text-[10px] uppercase tracking-wide text-stone-300">Kontent</p>
          {CONTENT_TYPE_LIST.map((c) => (
            <SidebarLink key={c.key} to={`/admin/${c.urlSlug}`} label={c.navLabel} icon={c.mapEmoji} />
          ))}
          <p className="mt-4 px-3 pb-1 font-mono text-[10px] uppercase tracking-wide text-stone-300">Boshqa</p>
          {EXTRA_LINKS.map((l) => (
            <SidebarLink key={l.to} to={l.to} label={l.label} icon={l.icon} />
          ))}
        </nav>
        <div className="border-t border-stone-200 px-4 py-4">
          <p className="font-body text-sm font-medium text-ink">{adminUser?.full_name ?? "Administrator"}</p>
          <p className="font-body text-xs text-stone-300">{roleLabel(adminUser?.role)}</p>
          <button onClick={handleSignOut} className="mt-2 font-body text-xs font-semibold text-clay underline">
            Chiqish
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopbar onSignOut={handleSignOut} />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, icon, end }: { to: string; label: string; icon: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-body text-sm font-medium transition ${
          isActive ? "bg-pine text-white" : "text-ink-soft hover:bg-pine-50"
        }`
      }
    >
      <span>{icon}</span>
      {label}
    </NavLink>
  );
}

function roleLabel(role?: string) {
  if (role === "super_admin") return "Bosh administrator";
  if (role === "content_manager") return "Kontent menejeri";
  if (role === "editor") return "Muharrir";
  return "";
}

function MobileTopbar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
      <span className="font-display text-lg font-semibold text-pine-600">XONABOD admin</span>
      <button onClick={onSignOut} className="font-body text-xs font-semibold text-clay underline">Chiqish</button>
    </div>
  );
}
