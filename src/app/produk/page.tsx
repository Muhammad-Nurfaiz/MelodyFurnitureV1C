'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css } from "@/legacy/produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { findSeries } from "@/lib/series";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import {
  BreadcrumbSkeleton,
  PageHeadingSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";
import { CatalogSidebarFilter } from "@/components/CatalogSidebarFilter";
import { getCatalogMeta, getProducts } from "@/services/api";
import { Product, CategoryOrSeriesItem } from "@/types";

// Helper untuk mengekstrak cursor secara fleksibel
const extractNextCursor = (res: any): string | null => {
  if (!res) return null;

  if (res.meta?.next_cursor) return res.meta.next_cursor;
  if (res.data?.meta?.next_cursor) return res.data.meta.next_cursor;

  const nextUrl = res.links?.next || res.data?.links?.next;
  if (nextUrl) {
    try {
      const url = new URL(nextUrl);
      return url.searchParams.get("cursor");
    } catch {
      const match = nextUrl.match(/[?&]cursor=([^&]+)/);
      return match ? match[1] : null;
    }
  }

  return res.next_cursor || res.data?.next_cursor || null;
};

function CatalogBreadcrumb() {
  const ready = useContentReady(350);
  return (
    <div className="bg-white border-b border-borderColor py-3 mb-5">
      <div className="max-w-[1200px] mx-auto px-4 text-xs md:text-sm text-textMuted">
        <SkeletonOverlay ready={ready} skeleton={<BreadcrumbSkeleton />}>
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>›</span>
            <span className="text-textDark font-medium">Katalog Produk</span>
          </div>
        </SkeletonOverlay>
      </div>
    </div>
  );
}

function SeriesHeader() {
  const searchParams = useSearchParams();
  const series = searchParams.get("series") ?? undefined;
  const data = findSeries(series);
  const ready = useContentReady(450);

  if (!data) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 mb-5">
      <div className="bg-white border border-borderColor rounded-lg p-4 md:p-6">
        <SkeletonOverlay ready={ready} skeleton={<PageHeadingSkeleton withBadge />}>
          <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-wide text-primary bg-[#F3F0FF] px-2 py-1 rounded">
            Series
          </span>
          <h1 className="mt-2 text-lg md:text-2xl font-bold text-textDark">{data.name}</h1>
          <p className="mt-2 text-xs md:text-sm text-textMuted leading-relaxed max-w-3xl">
            {data.description}
          </p>
        </SkeletonOverlay>
      </div>
    </section>
  );
}

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State Meta Data
  const [categories, setCategories] = useState<CategoryOrSeriesItem[]>([]);
  const [seriesList, setSeriesList] = useState<CategoryOrSeriesItem[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState<boolean>(true);

  // State Drawer & Input Search Mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter State dari URL
  const selectedCategory = searchParams.get("category") || "";
  const selectedSeries = searchParams.get("series") || "";
  const searchQuery = searchParams.get("search") || "";
  const onlySale = searchParams.get("sale") === "true";

  // Local State Input Search
  const [mobileSearchInput, setMobileSearchInput] = useState<string>(searchQuery);

  // State Produk & Pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<string>("default");

  // Synchronize Mobile Search Input dengan URL Search Query
  useEffect(() => {
    setMobileSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch Metadata (Categories & Series)
  useEffect(() => {
    async function fetchMeta() {
      try {
        setIsLoadingMeta(true);
        const { categories: fetchedCategories, seriesList: fetchedSeries } = await getCatalogMeta();
        setCategories(fetchedCategories || []);
        setSeriesList(fetchedSeries || []);
      } catch (error) {
        console.error("Gagal mengambil meta katalog:", error);
      } finally {
        setIsLoadingMeta(false);
      }
    }

    fetchMeta();
  }, []);

  // Helper Update Query Params
  const updateQueryParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Fetch Products berdasarkan Filter URL
  useEffect(() => {
    let isMounted = true;

    async function fetchProductList() {
      setLoadingProducts(true);
      setFetchError(null);
      try {
        const res = await getProducts({
          category: selectedCategory || undefined,
          series: selectedSeries || undefined,
          search: searchQuery || undefined,
          sale: onlySale || undefined,
        });

        if (isMounted) {
          const rawItems = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : Array.isArray((res?.data as any)?.data)
            ? (res?.data as any).data
            : [];

          setProducts(rawItems);
          setNextCursor(extractNextCursor(res));
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setFetchError(err?.message || "Gagal memuat produk dari server.");
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }

    fetchProductList();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSeries, searchQuery, onlySale]);

  // Handler Search Mobile
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: mobileSearchInput.trim() || null });
  };

  // Handler Load More
  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await getProducts({
        category: selectedCategory || undefined,
        series: selectedSeries || undefined,
        search: searchQuery || undefined,
        sale: onlySale || undefined,
        cursor: nextCursor,
      });

      const rawItems = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray((res?.data as any)?.data)
        ? (res?.data as any).data
        : [];

      setProducts((prev) => [...prev, ...rawItems]);
      setNextCursor(extractNextCursor(res));
    } catch (err) {
      console.error("Gagal memuat produk selanjutnya:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    updateQueryParams({ category: cat || null });
    setIsFilterOpen(false);
  };

  const handleSeriesChange = (series: string) => {
    updateQueryParams({ series: series || null });
    setIsFilterOpen(false);
  };

  const handleSaleToggle = (sale: boolean) => {
    updateQueryParams({ sale: sale ? "true" : null });
  };

  const handleReset = () => {
    setMobileSearchInput("");
    setSortBy("default");
    setIsFilterOpen(false);
    router.replace(pathname, { scroll: false });
  };

  // Sorting lokal
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].sort((a, b) => {
      const priceA = a.discount_price && a.discount_price > 0 ? a.discount_price : (a.price || a.original_price || 0);
      const priceB = b.discount_price && b.discount_price > 0 ? b.discount_price : (b.price || b.original_price || 0);

      if (sortBy === "low-to-high") return priceA - priceB;
      if (sortBy === "high-to-low") return priceB - priceA;
      return 0;
    });
  }, [products, sortBy]);

  return (
    <>
      <SeriesHeader />

      <main className="max-w-[1200px] mx-auto px-4 min-h-[600px]">
        <div className="flex flex-col md:flex-row gap-6">

          {/* SIDEBAR FILTER DESKTOP */}
          <aside
            id="desktopSidebarFilter"
            className="hidden md:block sticky w-[250px] p-5 bg-white border border-borderColor rounded-lg shadow-sm shrink-0 z-20 overflow-y-auto"
            style={{
              top: "calc(var(--navbar-height, 110px) + 20px)",
              maxHeight: "calc(100vh - var(--navbar-height, 110px) - 40px)",
            }}
          >
            <CatalogSidebarFilter
              categories={categories}
              seriesList={seriesList}
              selectedCategory={selectedCategory}
              selectedSeries={selectedSeries}
              onlySale={onlySale}
              isLoading={isLoadingMeta}
              onSelectCategory={handleCategoryChange}
              onSelectSeries={handleSeriesChange}
              onToggleSale={handleSaleToggle}
              onReset={handleReset}
              onClose={() => setIsFilterOpen(false)}
            />
          </aside>

          {/* MOBILE FILTER DRAWER / MODAL */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-sm">
              <div className="ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-borderColor mb-4">
                    <h3 className="font-bold text-base text-textDark">Filter Produk</h3>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 text-textMuted hover:text-textDark focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                  <CatalogSidebarFilter
                    categories={categories}
                    seriesList={seriesList}
                    selectedCategory={selectedCategory}
                    selectedSeries={selectedSeries}
                    onlySale={onlySale}
                    isLoading={isLoadingMeta}
                    onSelectCategory={handleCategoryChange}
                    onSelectSeries={handleSeriesChange}
                    onToggleSale={handleSaleToggle}
                    onReset={handleReset}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="mt-6 w-full py-2.5 bg-primary text-white font-bold text-sm rounded shadow hover:bg-opacity-90 transition"
                >
                  Tampilkan Hasil
                </button>
              </div>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1">
            {/* MOBILE SEARCH & FILTER BUTTON (STICKY) */}
            <div 
              className="flex md:hidden gap-2 mb-4 w-full sticky z-30 bg-bgLight pt-2 pb-1"
              style={{ top: "var(--navbar-height, 80px)" }}
            >
              <form onSubmit={handleMobileSearch} className="flex flex-1">
                <input
                  type="text"
                  value={mobileSearchInput}
                  onChange={(e) => setMobileSearchInput(e.target.value)}
                  placeholder="Cari meja, lemari, rak..."
                  className="w-full px-3 py-2 border border-borderColor rounded-l text-sm focus:border-primary focus:outline-none bg-white"
                />
                <button type="submit" className="bg-primary text-white px-4 rounded-r text-sm font-medium hover:bg-opacity-90 transition">
                  Cari
                </button>
              </form>
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="bg-white border border-borderColor rounded px-3 py-2 flex items-center justify-center text-textDark hover:bg-gray-50 focus:outline-none shrink-0"
                aria-label="Buka Filter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>

            {/* TOP BAR SORT (STICKY DESKTOP & MOBILE) */}
            <div
              className="sticky z-20 flex justify-between items-center bg-white p-3 md:p-4 border border-borderColor rounded shadow-sm text-xs md:text-sm mb-4 transition-all"
              style={{ top: "var(--navbar-height, 130px)" }}
            >
              <div className="text-textMuted">
                Menampilkan <span className="font-semibold text-textDark">{sortedProducts.length}</span> Produk
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-textMuted hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-borderColor p-1.5 rounded focus:outline-none text-textDark cursor-pointer font-medium text-xs md:text-sm"
                >
                  <option value="default">Paling Sesuai</option>
                  <option value="low-to-high">Harga Terendah</option>
                  <option value="high-to-low">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : fetchError ? (
              <div className="text-center py-16 bg-white border border-red-200 rounded-lg my-4 p-4">
                <p className="text-red-600 font-semibold text-sm mb-2">Terjadi kesalahan saat memuat data:</p>
                <p className="text-xs text-textMuted mb-4">{fetchError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white text-xs rounded hover:bg-opacity-90 transition"
                >
                  Muat Ulang Halaman
                </button>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div id="productGrid" className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                {sortedProducts.map((product, idx) => (
                  <ProductCard key={`${product.id || product.slug || idx}`} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-borderColor rounded-lg my-4">
                <p className="text-textMuted text-sm">Produk tidak ditemukan.</p>
                <button
                  onClick={handleReset}
                  className="mt-3 px-4 py-2 bg-primary text-white text-xs rounded hover:bg-opacity-90 transition"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* BUTTON LOAD MORE */}
            {nextCursor && (
              <div id="loadMoreArea" className="flex justify-center my-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-primary text-primary font-bold text-sm rounded shadow-sm hover:bg-primary hover:text-white transition-all duration-200 min-w-[180px] focus:outline-none disabled:opacity-50"
                >
                  <span>{loadingMore ? "Memuat..." : "Muat Lebih Banyak"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function Produk() {
  return (
    <LegacyPage
      theme="shop"
      css={css}
      js=""
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['inter']"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <Navbar />
      <CatalogBreadcrumb />
      <Suspense fallback={<div className="text-center py-10">Memuat Katalog...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}