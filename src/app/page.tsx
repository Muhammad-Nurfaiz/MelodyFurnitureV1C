'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LegacyPage } from "@/components/LegacyPage";
import { runInline } from "@/lib/legacy-runtime";
import { css } from "@/legacy/index.legacy";
import { PromoCarousel } from "@/components/PromoCarousel";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { CertificationSection } from "@/components/CertificationSection";
import { SidebarFilter } from "@/components/SidebarFilter";
import { getHomePageData } from "@/services/api";
import { HeroSlide, CategoryOrSeriesItem, Product } from "@/types";

// Komponen Skeleton untuk Card Produk
function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 animate-pulse flex flex-col justify-between h-[320px]">
      <div className="w-full h-44 bg-gray-200 rounded-md mb-3" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  );
}

export default function Index() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSearchInput, setMobileSearchInput] = useState("");

  // States Data API
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<CategoryOrSeriesItem[]>([]);
  const [seriesList, setSeriesList] = useState<CategoryOrSeriesItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function initPageData() {
      try {
        setIsLoading(true);
        const data = await getHomePageData();

        if (!isMounted) return;

        setHeroSlides(data.heroSlides || []);
        setCategories(data.categories || []);
        setSeriesList(data.seriesList || []);
        setProducts(data.products || []);
        setPromos(data.promos || []);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Rekomendasi Populer: ambil produk is_sale, diacak (random), maks 8 produk
  const popularProducts = useMemo(() => {
    const sales = products.filter((p) => p.is_sale);
    return [...sales].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [products]);

  // 2. Koleksi Utama: diurutkan dari rating tertinggi -> terendah, maks 20 produk
  const mainCollectionProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const ratingA = (a as any).average_rating ?? (a as any).rating ?? 0;
        const ratingB = (b as any).average_rating ?? (b as any).rating ?? 0;
        return Number(ratingB) - Number(ratingA);
      })
      .slice(0, 20);
  }, [products]);

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchInput.trim()) {
      router.push(`/produk?search=${encodeURIComponent(mobileSearchInput.trim())}`);
    } else {
      router.push("/produk");
    }
  };

  return (
    <LegacyPage
      theme="shop"
      css={css}
      js=""
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-['inter']"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <>
        <Navbar />
        <CertificationSection />

        <main className="max-w-[1200px] mx-auto px-4">
          {/* Hero Slider Skeleton / Component */}
          {isLoading ? (
            <div className="w-full h-[220px] md:h-[380px] bg-gray-200 animate-pulse rounded-lg mb-4" />
          ) : (
            heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />
          )}

          {/* Promo Banner Skeleton / Component */}
          {isLoading ? (
            <div className="w-full h-24 md:h-32 bg-gray-200 animate-pulse rounded-lg mb-6" />
          ) : (
            <PromoCarousel data={promos} />
          )}

          {/* Mobile Search & Filter Button */}
          <div className="flex md:hidden gap-2 mb-5 w-full">
            <form onSubmit={handleMobileSearch} className="flex flex-1">
              <input
                type="text"
                value={mobileSearchInput}
                onChange={(e) => setMobileSearchInput(e.target.value)}
                placeholder="Cari meja, lemari, rak..."
                className="w-full px-3 py-2 border border-gray-300 rounded-l text-sm focus:border-primary focus:outline-none bg-white"
              />
              <button type="submit" className="bg-primary text-white px-4 rounded-r text-sm font-medium">
                Cari
              </button>
            </form>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="bg-white border border-gray-300 rounded p-2 flex items-center justify-center text-textDark hover:bg-gray-50 focus:outline-none shrink-0"
              aria-label="Buka Filter"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Sidebar & Catalogue */}
          <div className="flex flex-col md:flex-row gap-5 mt-5">
            <SidebarFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              categories={categories}
              seriesList={seriesList}
              isLoading={isLoading}
            />

            {/* Content Produk Utama */}
            <div className="flex-1">
              {/* SECTION 1: REKOMENDASI POPULER */}
              <div className="flex justify-between items-center mb-4 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">
                  Rekomendasi Populer
                </div>
                <Link
                  href="/produk?sale=true"
                  className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition"
                >
                  Lihat Semua →
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : popularProducts.length > 0 ? (
                  popularProducts.map((product, idx) => (
                    <ProductCard key={`${product.id || idx}`} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-sm text-textMuted bg-white rounded">
                    Tidak ada produk rekomendasi populer.
                  </div>
                )}
              </div>

              {/* SECTION 2: SEMUA KOLEKSI FURNITUR TERBAIK */}
              <div className="flex justify-between items-center mb-4 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">
                  Semua Koleksi Furnitur Terbaik
                </div>
                <Link
                  href="/produk"
                  className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition"
                >
                  Lihat Semua →
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
                ) : mainCollectionProducts.length > 0 ? (
                  mainCollectionProducts.map((product, idx) => (
                    <ProductCard key={`${product.id || idx}`} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 text-sm text-textMuted bg-white rounded">
                    Belum ada produk yang tersedia saat ini.
                  </div>
                )}
              </div>
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