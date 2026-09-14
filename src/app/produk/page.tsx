'use client';

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { findSeries } from "@/lib/series";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BreadcrumbSkeleton,
  FilterPanelSkeleton,
  PageHeadingSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";

// --- INTERFACE SINKRON DENGAN INDEX.TSX ---
interface Thumbnail {
  id: string;
  url: string;
  alt_text: string;
}

interface CategoryOrSeries {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number | null;
  is_sale: boolean;
  price: number;
  formatted_price: string;
  average_rating: number;
  total_sold: number;
  origin_city: string;
  thumbnail: Thumbnail;
  category: CategoryOrSeries;
  series: CategoryOrSeries | null;
  program_slug?: string;
}

// --- DUMMY FILTER DATA ---
const CATEGORIES: CategoryOrSeries[] = [
  { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
  { id: "cat-002", name: "Lemari Buffet", slug: "lemari-buffet" },
  { id: "cat-003", name: "Nakas Minimalis", slug: "nakas-minimalis" },
  { id: "cat-004", name: "Meja & Rak TV", slug: "meja-tv" },
];

const SERIES_LIST: CategoryOrSeries[] = [
  { id: "ser-001", name: "Minimalist", slug: "minimalist" },
  { id: "ser-002", name: "Industrial", slug: "industrial" },
  { id: "ser-003", name: "Scandinavian", slug: "scandinavian" },
  { id: "ser-004", name: "Luxury", slug: "luxury" },
];

const SPECIAL_PROGRAMS = [
  { name: "Promo Terbatas", slug: "promo-terbatas" },
];

// Helper Format Rupiah (Aman dari Mismatch Spasi Server vs Client)
const formatRupiah = (val: number) => {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
  
  return formatted.replace(/\s+/g, " ");
};

// --- DUMMY PRODUCTS (DETERMINISTIK TANPA Math.random) ---
const DUMMY_PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => {
  const index = i + 1;
  const category = CATEGORIES[i % CATEGORIES.length];
  const series = SERIES_LIST[i % SERIES_LIST.length];
  const program = SPECIAL_PROGRAMS[i % SPECIAL_PROGRAMS.length];

  const basePrice = ((i % 20) + 5) * 100000;
  const isSale = i % 2 === 0;
  const discountPercentage = isSale ? (i % 3 === 0 ? 30 : 20) : null;
  const discountPrice = isSale && discountPercentage ? basePrice * (1 - discountPercentage / 100) : 0;
  const finalPrice = discountPrice > 0 ? discountPrice : basePrice;

  return {
    id: `prod-${index}`,
    name: `Furnitur Minimalis Modern Tipe ${index} - Series ${series.name}`,
    slug: `furnitur-minimalis-modern-tipe-${index}`,
    original_price: basePrice,
    discount_price: discountPrice,
    discount_percentage: discountPercentage,
    is_sale: isSale,
    price: finalPrice,
    formatted_price: formatRupiah(finalPrice),
    average_rating: Number((4.0 + (i % 10) * 0.1).toFixed(1)),
    total_sold: 15 + i * 5,
    origin_city: "Malang",
    thumbnail: {
      id: `thumb-${index}`,
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80",
      alt_text: `Furnitur Minimalis ${index}`,
    },
    category: category,
    series: series,
    program_slug: program.slug,
  };
});

// --- SUB-KOMPONEN ---

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

function FilterSection({ children }: { children: React.ReactNode }) {
  const ready = useContentReady(450);
  return (
    <SkeletonOverlay ready={ready} skeleton={<FilterPanelSkeleton />}>
      {children}
    </SkeletonOverlay>
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

function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.discount_price > 0 ? product.discount_price : product.price;

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="product-card bg-white rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group relative"
    >
      <div className="relative w-full h-44 overflow-hidden bg-[#FAFAFA]">
        <img
          src={product.thumbnail?.url || "/assets/img/placeholder.webp"}
          alt={product.thumbnail?.alt_text || product.name}
          className="w-full h-full object-cover"
        />

        {product.is_sale && (
          <div className="absolute top-2 left-2 bg-secondary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded shadow z-10 uppercase tracking-wider">
            PROMO
          </div>
        )}

        {product.discount_percentage !== null && product.discount_percentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded shadow z-10">
            {product.discount_percentage}% OFF
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xs md:text-sm font-bold mb-1.5 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.original_price > displayPrice ? (
            <div className="text-gray-400 line-through text-xs">
              {formatRupiah(product.original_price)}
            </div>
          ) : (
            <div className="h-4" />
          )}

          <div className="mt-1">
            <div className="text-secondary text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap">
              {product.formatted_price && product.formatted_price !== "Rp 0"
                ? product.formatted_price
                : formatRupiah(displayPrice)}
            </div>
          </div>
        </div>

        <div className="text-[10px] md:text-xs text-textMuted mt-3 pt-1.5 border-t border-[#F0F0F0] flex justify-between items-center">
          <span className="flex items-center gap-1">
            ⭐ {product.average_rating}
            {product.total_sold ? ` | Terjual ${product.total_sold}+` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function Produk() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter & Logic Sorting
  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory ? item.category.slug === selectedCategory : true;
      const matchesSeries = selectedSeries ? item.series?.slug === selectedSeries : true;
      const matchesProgram = selectedProgram ? item.program_slug === selectedProgram : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSeries && matchesProgram && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.discount_price > 0 ? a.discount_price : a.price;
      const priceB = b.discount_price > 0 ? b.discount_price : b.price;

      if (sortBy === "low-to-high") return priceA - priceB;
      if (sortBy === "high-to-low") return priceB - priceA;
      return 0;
    });
  }, [selectedCategory, selectedSeries, selectedProgram, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleReset = () => {
    setSelectedCategory("");
    setSelectedSeries("");
    setSelectedProgram("");
    setSearchQuery("");
    setSortBy("default");
    setVisibleCount(12);
  };

  // Komponen Konten Filter
  const FilterContent = () => (
    <FilterSection>
      <div className="mb-4">
        <button 
          onClick={handleReset}
          className="btn-reset-filter w-full py-1.5 border border-dashed border-secondary text-secondary hover:bg-secondary hover:text-white rounded text-xs font-semibold transition"
        >
          Semua Produk (Reset)
        </button>
      </div>

      {/* Kategori Produk */}
      <div className="mb-6">
        <div className="text-xs md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Kategori Produk
        </div>
        <ul className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
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
          ))}
        </ul>
      </div>

      {/* Series Produk */}
      <div className="mb-6">
        <div className="text-xs md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Series Produk
        </div>
        <ul className="flex flex-col gap-1">
          {SERIES_LIST.map((ser) => (
            <li key={ser.id}>
              <button
                onClick={() => setSelectedSeries(selectedSeries === ser.slug ? "" : ser.slug)}
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
          ))}
        </ul>
      </div>

      {/* Program Spesial */}
      <div>
        <div className="text-xs md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
          Program Spesial
        </div>
        <ul className="flex flex-col gap-1">
          {SPECIAL_PROGRAMS.map((prog) => (
            <li key={prog.slug}>
              <button
                onClick={() => setSelectedProgram(selectedProgram === prog.slug ? "" : prog.slug)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md transition ${
                  selectedProgram === prog.slug 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:text-primary hover:bg-[#F1F3F5]"
                }`}
              >
                <span>{prog.name}</span>
                <span className={`text-xs leading-none ${selectedProgram === prog.slug ? "text-white" : "text-gray-400"}`}>›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </FilterSection>
  );

  return (
    <LegacyPage
      theme="shop"
      css={css}
      js="" // Prop js ditambahkan kembali agar tidak undefined
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['inter']"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <>
        <Navbar />
        <CatalogBreadcrumb />

        <Suspense fallback={null}>
          <SeriesHeader />
        </Suspense>

        <main className="max-w-[1200px] mx-auto px-4 min-h-[600px]">
          <div className="flex flex-col md:flex-row gap-6">

            {/* --- DESKTOP SIDEBAR FILTER --- */}
            <aside 
              id="desktopSidebarFilter" 
              className="hidden md:block sticky w-[250px] p-5 bg-white border border-borderColor rounded-lg shadow-sm shrink-0 z-20 overflow-y-auto" 
              style={{ top: "calc(var(--navbar-height, 110px) + 20px)", maxHeight: "calc(100vh - var(--navbar-height, 110px) - 40px)" }}
            >
              <FilterContent />
            </aside>

            {/* --- MOBILE/TABLET DRAWER SIDEBAR FILTER --- */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 flex justify-end md:hidden">
                <div 
                  className="fixed inset-0 bg-black/50 transition-opacity"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                
                <div className="relative w-4/5 max-w-xs bg-white h-full p-5 shadow-xl z-10 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-borderColor">
                      <h2 className="font-bold text-base text-textDark">Filter Produk</h2>
                      <button 
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="text-gray-500 hover:text-textDark font-bold text-xl px-2"
                      >
                        ✕
                      </button>
                    </div>
                    <FilterContent />
                  </div>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full mt-6 py-2.5 bg-primary text-white font-bold rounded text-xs text-center"
                  >
                    Tampilkan ({filteredProducts.length}) Produk
                  </button>
                </div>
              </div>
            )}

            {/* --- KATALOG PRODUK UTAMA --- */}
            <div className="flex-1">
              {/* Top Search & Filter Mobile & Tablet */}
              <div className="block md:hidden sticky-under-navbar bg-bgLight pt-1 pb-3 z-30">
                <div id="mobileSearchFilter" className="flex gap-2 mb-3 w-full bg-bgLight py-1">
                  <div className="flex flex-1">
                    <input
                      type="text"
                      placeholder="Cari meja, lemari, rak..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-r-0 border-gray-300 rounded-l text-sm focus:border-primary focus:outline-none bg-white"
                    />
                    <button 
                      type="button"
                      aria-label="Cari"
                      className="px-3.5 bg-primary text-white rounded-r flex items-center justify-center hover:bg-opacity-90 transition-colors"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="px-3 py-2 bg-white border border-borderColor rounded text-xs font-semibold text-textDark flex items-center gap-1 shrink-0 hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-center bg-white p-3 border border-borderColor rounded shadow-sm text-xs sm:text-sm">
                  <div className="text-textMuted">
                    Menampilkan <span className="font-semibold text-textDark">{filteredProducts.length}</span> Produk
                  </div>
                  <div className="flex items-center gap-2">
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
              </div>

              {/* Top Bar Sort Desktop */}
              <div className="hidden md:flex sticky justify-between items-center bg-white p-4 border border-borderColor rounded shadow-sm text-sm mb-4 z-20 transition-all" style={{ top: "calc(var(--navbar-height, 110px) + 20px)" }}>
                <div className="text-textMuted">
                  Menampilkan <span className="font-semibold text-textDark">{filteredProducts.length}</span> Produk
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

              {/* --- GRID PRODUK --- */}
              {displayedProducts.length > 0 ? (
                <div id="productGrid" className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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

              {/* --- BUTTON LOAD MORE --- */}
              {visibleCount < filteredProducts.length && (
                <div id="loadMoreArea" className="flex justify-center my-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-primary text-primary font-bold text-sm rounded shadow-sm hover:bg-primary hover:text-white transition-all duration-200 min-w-[180px] focus:outline-none"
                  >
                    <span>Muat Lebih Banyak</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </main>

        <Footer />
        <ChatWidget />
      </>
    </LegacyPage>
  );
}

void runInline;