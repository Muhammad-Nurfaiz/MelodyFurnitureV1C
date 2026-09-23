'use client';

import React, { useRef, useEffect } from "react";
import { CategoryOrSeriesItem } from "@/types";
import { FilterPanelSkeleton } from "@/components/ContentSkeleton";

interface FilterSidebarProps {
  categories: CategoryOrSeriesItem[];
  seriesList: CategoryOrSeriesItem[];
  selectedCategory: string;
  selectedSeries: string;
  onlySale: boolean;
  isLoading?: boolean; // State loading dari parent/data fetching
  onSelectCategory: (slug: string) => void;
  onSelectSeries: (slug: string) => void;
  onToggleSale: (val: boolean) => void;
  onReset: () => void;
  onClose?: () => void; // Prop opsional untuk menutup sidebar
}

export function CatalogSidebarFilter({
  categories,
  seriesList,
  selectedCategory,
  selectedSeries,
  onlySale,
  isLoading = false,
  onSelectCategory,
  onSelectSeries,
  onToggleSale,
  onReset,
  onClose,
}: FilterSidebarProps) {
  // Ref untuk mendeteksi elemen pembungkus sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Effect untuk mendeteksi klik di luar area sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        onClose
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Cek apakah data masih dalam proses loading atau array categories/seriesList belum siap
  const isDataNotReady = isLoading || !categories || !seriesList;

  if (isDataNotReady) {
    return <FilterPanelSkeleton />;
  }

  return (
    <div ref={sidebarRef} className="w-full">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={onReset}
          className="btn-reset-filter w-full py-1.5 border border-dashed border-secondary text-secondary hover:bg-secondary hover:text-white rounded text-xs font-semibold transition"
        >
          Semua Produk (Reset)
        </button>
      </div>

      {/* Filter Kategori */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Kategori Produk
        </div>
        <ul className="flex flex-col gap-1">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat.id || cat.slug}>
                <button
                  onClick={() => onSelectCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md transition ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-[#F1F3F5]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-xs leading-none ${selectedCategory === cat.slug ? "text-white" : "text-gray-400"}`}>›</span>
                </button>
              </li>
            ))
          ) : (
            <li className="text-xs text-textMuted px-3 py-1">Tidak ada kategori</li>
          )}
        </ul>
      </div>

      {/* Filter Series */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Series Produk
        </div>
        <ul className="flex flex-col gap-1">
          {seriesList.length > 0 ? (
            seriesList.map((ser) => (
              <li key={ser.id || ser.slug}>
                <button
                  onClick={() => onSelectSeries(selectedSeries === ser.slug ? "" : ser.slug)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md transition ${
                    selectedSeries === ser.slug
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-[#F1F3F5]"
                  }`}
                >
                  <span>{ser.name}</span>
                  <span className={`text-xs leading-none ${selectedSeries === ser.slug ? "text-white" : "text-gray-400"}`}>›</span>
                </button>
              </li>
            ))
          ) : (
            <li className="text-xs text-textMuted px-3 py-1">Tidak ada series</li>
          )}
        </ul>
      </div>

      {/* Filter Promo Terbatas */}
      <div className="mb-4 pt-4 border-t border-borderColor">
        <div className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Penawaran Khusus
        </div>
        <label className="flex items-center justify-between px-3 py-2.5 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-md cursor-pointer transition select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-red-600">🔥 Promo Terbatas</span>
          </div>
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => onToggleSale(e.target.checked)}
            className="w-4 h-4 text-primary accent-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}