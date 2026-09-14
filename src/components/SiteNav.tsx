'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/produk", label: "Katalog Produk" },
  { to: "/form-track", label: "Lacak Pesanan" },
] as const;

export function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden md:block border-t border-borderColor bg-white"
    >
      <ul className="max-w-[1200px] mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        {NAV_LINKS.map((item) => {
          const active = pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                href={item.to}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 transition ${
                  active
                    ? "text-primary border-primary font-semibold"
                    : "text-gray-700 border-transparent hover:text-primary hover:border-primary/40"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileNavToggle() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden bg-white rounded p-2 flex items-center justify-center text-textDark hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        aria-label="Buka menu navigasi"
        aria-expanded={open}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        className={`md:hidden fixed inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white p-5 z-[70] border-r border-borderColor overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-borderColor">
          <span className="font-bold text-primary">Menu Navigasi</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu navigasi"
            className="text-textMuted hover:text-textDark text-xl font-bold"
          >
            ×
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition ${
                    active
                      ? "text-primary bg-[#E6EEFA] font-semibold"
                      : "text-gray-700 font-medium hover:text-primary hover:bg-[#F1F3F5]"
                  }`}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-lg leading-none">›</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
