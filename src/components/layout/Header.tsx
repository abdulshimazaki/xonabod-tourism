import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CONTENT_TYPE_LIST } from "../../config/contentTypes";

const NAV_LINKS = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/xonobod-haqida", label: "Xonobod haqida" },
  ...CONTENT_TYPE_LIST.map((c) => ({ to: `/${c.urlSlug}`, label: c.navLabel })),
  { to: "/tadbirlar", label: "Tadbirlar" },
  { to: "/media", label: "Media" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-pine-600">XONOBOD</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-gold-600 sm:inline">Turizm portali</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body text-sm font-medium transition hover:text-pine ${isActive ? "text-pine" : "text-ink-soft"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/qidiruv" aria-label="Qidiruv" className="rounded-full p-2 text-ink-soft transition hover:bg-pine-50 hover:text-pine">
            <SearchIcon />
          </Link>
          <button
            aria-label="Menyu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink-soft transition hover:bg-pine-50 hover:text-pine lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-stone-50 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 font-body text-sm font-medium ${isActive ? "bg-pine-50 text-pine" : "text-ink-soft"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
