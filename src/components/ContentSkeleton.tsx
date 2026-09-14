'use client';

import { useEffect, useState, type ReactNode } from "react";

/**
 * Loading state konsisten untuk komponen non-produk (breadcrumb, judul halaman,
 * panel filter). Skeleton dirender saat SSR & render pertama di klien, lalu
 * ditukar dengan konten asli setelah jeda singkat agar transisinya halus.
 */
export function useContentReady(delay = 450) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);
  return ready;
}

export function Skel({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`melody-skel ${className}`} />;
}

function Wrap({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label="Memuat konten">
      <span className="sr-only">Memuat konten…</span>
      {children}
    </div>
  );
}

export function BreadcrumbSkeleton({ items = 3 }: { items?: number }) {
  return (
    <Wrap>
      <div className="flex items-center gap-2">
        {Array.from({ length: items }).map((_, i) => (
          <Skel key={i} className={`h-3 ${i === items - 1 ? "w-28" : "w-16"}`} />
        ))}
      </div>
    </Wrap>
  );
}

export function PageHeadingSkeleton({ withBadge = false }: { withBadge?: boolean }) {
  return (
    <Wrap>
      <div className="space-y-3">
        {withBadge ? <Skel className="h-4 w-16" /> : null}
        <Skel className="h-6 md:h-8 w-3/4 max-w-md" />
        <Skel className="h-3 w-full max-w-2xl" />
        <Skel className="h-3 w-2/3 max-w-xl" />
      </div>
    </Wrap>
  );
}

export function FilterPanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Wrap>
      <div className="space-y-5">
        <Skel className="h-8 w-full" />
        <div className="space-y-2">
          <Skel className="h-3 w-28" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skel key={i} className="h-8 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          <Skel className="h-3 w-24" />
          <Skel className="h-8 w-full" />
          <Skel className="h-8 w-full" />
        </div>
      </div>
    </Wrap>
  );
}

/**
 * Menampilkan skeleton di atas konten aslinya. Konten tetap ada di DOM
 * (hanya disembunyikan) supaya skrip yang memasang event listener saat mount
 * tetap menemukan elemennya.
 */
export function SkeletonOverlay({
  ready,
  skeleton,
  children,
  className = "",
}: {
  ready: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {!ready ? <div className="absolute inset-0 z-10">{skeleton}</div> : null}
      <div
        className={ready ? "transition-opacity duration-300 opacity-100" : "opacity-0 pointer-events-none"}
      >
        {children}
      </div>
    </div>
  );
}

/** Skeleton penuh untuk halaman detail produk (galeri, harga, stok, series, card). */
export function ProductDetailSkeleton() {
  return (
    <Wrap>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Galeri */}
        <div className="space-y-4">
          <Skel className="w-full aspect-square rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skel key={i} className="h-16 w-16 md:h-20 md:w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info produk */}
        <div className="space-y-6">
          <div className="space-y-3">
            <BreadcrumbSkeleton />
            <Skel className="h-6 md:h-8 w-3/4" />
          </div>
          <div className="flex items-baseline gap-3">
            <Skel className="h-7 w-40" />
            <Skel className="h-4 w-24" />
            <Skel className="h-4 w-12" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Skel className="h-8 w-44 rounded-full" />
            <Skel className="h-4 w-40" />
          </div>
          <div className="space-y-2">
            <Skel className="h-3 w-full" />
            <Skel className="h-3 w-5/6" />
            <Skel className="h-3 w-2/3" />
          </div>
          <div className="flex gap-3">
            <Skel className="h-11 w-32 rounded-lg" />
            <Skel className="h-11 flex-1 rounded-lg" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skel key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Card produk lainnya / series */}
      <div className="mt-12 space-y-4">
        <Skel className="h-5 w-56" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-borderColor/60 p-3">
              <Skel className="w-full aspect-square rounded-lg" />
              <Skel className="h-3 w-full" />
              <Skel className="h-3 w-2/3" />
              <Skel className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  );
}
