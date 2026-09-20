import Link from "next/link";
import { CategoryOrSeriesItem } from "@/types";

interface SidebarFilterProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOrSeriesItem[];
  seriesList: CategoryOrSeriesItem[];
  isLoading?: boolean; // Tambahkan prop isLoading
}

export function SidebarFilter({
  isOpen,
  onClose,
  categories,
  seriesList,
  isLoading = false,
}: SidebarFilterProps) {
  const specialPrograms = [
    { name: "Promo Terbatas", href: "/produk?sale=true" }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 w-[280px] bg-white p-5 z-50 transform transition-transform duration-300 ease-in-out border-l border-borderColor overflow-y-auto 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:translate-x-0 md:w-[250px] md:p-5 md:rounded-lg md:h-fit md:shadow-sm md:border md:z-10 shrink-0`}
      >
        <div className="flex md:hidden justify-between items-center mb-6 pb-2 border-b border-borderColor">
          <span className="font-bold text-primary">Filter &amp; Kategori</span>
          <button
            type="button"
            onClick={onClose}
            className="text-textMuted hover:text-textDark text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Kategori API */}
        <div className="mb-6">
          <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
            Kategori Produk
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-md w-full" />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {categories.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/produk?category=${item.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                  >
                    <span>{item.name}</span>
                    <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Series API */}
        <div className="mb-6">
          <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
            Series Produk
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-md w-full" />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {seriesList.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/produk?series=${item.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                  >
                    <span>{item.name}</span>
                    <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Program Spesial */}
        <div>
          <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
            Program Spesial
          </div>
          <ul className="flex flex-col gap-1">
            {specialPrograms.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                >
                  <span>{item.name}</span>
                  <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}