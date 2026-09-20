// components/product/ProductAccordion.tsx
'use client';

import { useState } from "react";
import { Product } from "@/types";

export function ProductAccordion({ product }: { product: Product | null }) {
  // Menggunakan Set untuk menyimpan key accordion mana saja yang sedang terbuka
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["spesifikasi"])
  );

  const toggleAccordion = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isOpen = (key: string) => openSections.has(key);

  return (
    <div className="border-t border-borderColor pt-6 space-y-4">
      {/* Spesifikasi */}
      <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => toggleAccordion("spesifikasi")}
        >
          <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
            <span className="material-symbols-outlined text-primary">straighten</span>
            <span>Spesifikasi Produk</span>
          </span>
          <span className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${isOpen("spesifikasi") ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
        {isOpen("spesifikasi") && (
          <div className="px-4 pb-4 bg-white text-xs md:text-sm">
            <div className="space-y-3 pt-2">
              {product?.specification?.dimensions && (
                <div className="flex justify-between border-b border-borderColor pb-2">
                  <span className="text-textMuted">Dimensi</span>
                  <span className="font-medium">{product.specification.dimensions}</span>
                </div>
              )}
              {product?.specification?.weight && (
                <div className="flex justify-between border-b border-borderColor pb-2">
                  <span className="text-textMuted">Berat Produk</span>
                  <span className="font-medium">{product.specification.weight} kg</span>
                </div>
              )}
              {product?.specification?.packing_weight && (
                <div className="flex justify-between border-b border-borderColor pb-2">
                  <span className="text-textMuted">Berat Packing</span>
                  <span className="font-medium">{product.specification.packing_weight} kg</span>
                </div>
              )}
              {product?.specification?.load_capacity && (
                <div className="flex justify-between border-b border-borderColor pb-2">
                  <span className="text-textMuted">Kapasitas Beban</span>
                  <span className="font-medium">{product.specification.load_capacity} kg</span>
                </div>
              )}
              {product?.specification?.assembly_required !== undefined && (
                <div className="flex justify-between">
                  <span className="text-textMuted">Perakitan</span>
                  <span className="font-medium">
                    {product.specification.assembly_required ? "Perlu Dirakit" : "Tanpa Perakitan"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Material */}
      <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => toggleAccordion("material")}
        >
          <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
            <span className="material-symbols-outlined text-primary">inventory_2</span>
            <span>Detail Produk &amp; Material</span>
          </span>
          <span className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${isOpen("material") ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
        {isOpen("material") && (
          <div className="px-4 pb-4 bg-white text-xs md:text-sm">
            <div className="pt-2 space-y-2 text-textMuted">
              <p className="whitespace-pre-line">{product?.product_detail}</p>
              <ul className="space-y-1 pt-2 border-t border-borderColor">
                <li className="flex items-center space-x-2">
                  <span className="text-secondary">•</span>
                  <span>Sertifikasi: ISO Certified 9001-2015, FSC, Indonesian Legal Wood</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Pengiriman */}
      <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => toggleAccordion("pengiriman")}
        >
          <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span>Informasi Pengiriman</span>
          </span>
          <span className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${isOpen("pengiriman") ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
        {isOpen("pengiriman") && (
          <div className="px-4 pb-4 bg-white text-xs md:text-sm">
            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="p-3 border border-borderColor rounded bg-bgLight">
                <p className="text-xs text-textMuted mt-1">
                  Pengiriman dilakukan dari Gudang {product?.origin_city || "Malang"}. 
                  Gratis ongkir untuk pengiriman area Pulau Jawa &amp; Bali dengan kargo pilihan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}