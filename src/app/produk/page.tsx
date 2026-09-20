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

// Helper untuk mengekstrak cursor secara fleksibel dari berbagai format response API
const extractNextCursor = (res: any): string | null => {
  if (!res) return null;

  // 1. Cek dari objek meta
  if (res.meta?.next_cursor) return res.meta.next_cursor;
  if (res.data?.meta?.next_cursor) return res.data.meta.next_cursor;

  // 2. Cek jika backend mengirim links.next (URL) -> ambil query param 'cursor'
  const nextUrl = res.links?.next || res.data?.links?.next;
  if (nextUrl) {
    try {
      const url = new URL(nextUrl);
      return url.searchParams.get("cursor");
    } catch {
      // Jika nextUrl berupa relative path
      const match = nextUrl.match(/[?&]cursor=([^&]+)/);
      return match ? match[1] : null;
    }
  }

  // 3. Fallback direct property
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

  // State Produk & Pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter State dari URL
  const selectedCategory = searchParams.get("category") || "";
  const selectedSeries = searchParams.get("series") || "";
  const searchQuery = searchParams.get("search") || "";
  const onlySale = searchParams.get("sale") === "true";
  const [isLoadingMeta, setIsLoadingMeta] = useState<boolean>(true);

  // Local State UI
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    async function fetchMeta() {
      try {
        setIsLoadingMeta(true);
        // Memanggil fungsi getCatalogMeta yang mengembalikan { categories, seriesList }
        const { categories: fetchedCategories, seriesList: fetchedSeries } = await getCatalogMeta();

        setCategories(fetchedCategories);
        setSeriesList(fetchedSeries);
      } catch (error) {
        console.error("Gagal mengambil meta katalog:", error);
      } finally {
        setIsLoadingMeta(false);
      }
    }

    fetchMeta();
  }, []);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // 1. Fetch Metadata (Categories & Series)
  useEffect(() => {
    let isMounted = true;
    async function fetchMeta() {
      try {
        const data = await getCatalogMeta();
        if (isMounted) {
          setCategories(data.categories || []);
          setSeriesList(data.seriesList || []);
        }
      } catch (err) {
        console.error("Gagal mengambil metadata katalog:", err);
      }
    }
    fetchMeta();
    return () => {
      isMounted = false;
    };
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

  // 2. Fetch Products berdasarkan Filter URL
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

  // 3. Handler Load More
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

  const handleCategoryChange = (cat: string) => updateQueryParams({ category: cat || null });
  const handleSeriesChange = (series: string) => updateQueryParams({ series: series || null });
  const handleSaleToggle = (sale: boolean) => updateQueryParams({ sale: sale ? "true" : null });

  const handleReset = () => {
    setSearchInput("");
    setSortBy("default");
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
            />
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1">
            {/* TOP BAR SORT DESKTOP */}
            <div
              className="hidden md:flex sticky justify-between items-center bg-white p-4 border border-borderColor rounded shadow-sm text-sm mb-4 z-20 transition-all"
              style={{ top: "calc(var(--navbar-height, 110px) + 20px)" }}
            >
              <div className="text-textMuted">
                Menampilkan <span className="font-semibold text-textDark">{sortedProducts.length}</span> Produk
              </div>
              <div className="flex items-center gap-2">
                <span className="text-textMuted">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-borderColor p-1.5 rounded focus:outline-none text-textDark cursor-pointer font-medium"
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