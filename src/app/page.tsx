'use client';

import { useState, useEffect, useCallback } from "react";
import { LegacyPage } from "@/components/LegacyPage";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/index.legacy";
import { PromoCarousel } from "@/components/PromoCarousel";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Interface Data Produk
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
}

// Interface Hero Banner sesuai JSON backend
interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string | null;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  sort_order: number;
}

// Interface Kategori & Series dari Backend JSON
interface CategoryOrSeriesItem {
  id: string;
  name: string;
  slug: string;
}

// --- DATA DUMMY HERO BANNER (Persis key JSON Backend) ---
const dummyHeroData: HeroSlide[] = [
  {
    id: "019fd770-c8ac-73bb-9a72-fdb43402ce37",
    image: "http://127.0.0.1:8000/storage/settings/hero/4cbdfee9-5ff0-44cb-9250-22e15bb0d665.png",
    eyebrow: null,
    title: "Koleksi Eksklusif Furnitur Minimalis & Modern",
    description: "Kualitas ekspor dengan harga lokal, langsung dari pabrik terbesar di Indonesia. Dapatkan jaminan ketahanan produk standar internasional.",
    button_text: "Lihat Koleksi",
    button_url: "https://melodyfurniture.co.id",
    sort_order: 1
  },
  {
    id: "019fd78f-4b23-702a-943d-1850d13de625",
    image: "http://127.0.0.1:8000/storage/settings/hero/702f878f-277e-4e20-8e00-8b8a2d0683f3.webp",
    eyebrow: "PROMO SPESIAL BULAN INI",
    title: "Hemat Hingga 50% Untuk Set Meja Kerja & Ruang Tamu",
    description: "Jangan lewatkan kesempatan mempercantik hunian Anda dengan promo terbatas dan gratis ongkos kirim area tertentu.",
    button_text: "Belanja Sekarang",
    button_url: "https://melodyfurniture.co.id",
    sort_order: 2
  }
];

// --- DATA DUMMY KATEGORI ---
const dummyCategoriesData: CategoryOrSeriesItem[] = [
  { id: "019fa749-ade1-7192-832b-f85e9ed88bf6", name: "Cabinet", slug: "cabinet" },
  { id: "019fa749-adb8-71ed-9e94-2f16d530a72d", name: "Chair", slug: "chair" },
  { id: "019fa749-add4-73f0-95b4-2d76452368da", name: "Sofa", slug: "sofa" },
  { id: "019fa749-aded-7020-93d7-7d6cc7c66c17", name: "Storage", slug: "storage" },
  { id: "019fa749-adc6-7105-95ad-ad036714cf34", name: "Table", slug: "table" }
];

// --- DATA DUMMY SERIES ---
const dummySeriesData: CategoryOrSeriesItem[] = [
  { id: "019fa749-ae45-73d0-b6b0-aeee3ae2e4d5", name: "Industrial", slug: "industrial" },
  { id: "019fa749-ae5f-735d-a633-790fba37b2b0", name: "Luxury", slug: "luxury" },
  { id: "019fa749-ae38-72b3-98e6-e124afc24396", name: "Minimalist", slug: "minimalist" },
  { id: "019fa749-ae53-721e-91b0-8c7c950543d1", name: "Modern", slug: "modern" },
  { id: "019fa749-ae2b-71b1-aa7b-59ad51639f88", name: "Scandinavian", slug: "scandinavian" }
];

// --- PROGRAM SPESIAL ---
const specialPrograms = [
  { name: "Promo Terbatas", href: "/produk?program=promo-terbatas" }
];

// Data Produk
const rawProducts: Product[] = [
  {
    id: "prod-001",
    name: "Meja Kerja Sudut Meja Belajar Kantor Tipe L Minimalis Modern",
    slug: "meja-kerja-sudut-tipe-l",
    original_price: 2190000,
    discount_price: 1599000,
    discount_percentage: 27,
    is_sale: true,
    price: 1599000,
    formatted_price: "Rp 1.599.000",
    average_rating: 4.9,
    total_sold: 250,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-001",
      url: "https://cf.shopee.co.id/file/id-11134207-822wm-mmzke5kx2bk51c",
      alt_text: "Meja Kerja Sudut",
    },
    category: { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
    series: null,
  },
  {
    id: "prod-002",
    name: "Meja kerja Meja Belajar tipe L LIBRE 127 E",
    slug: "meja-kerja-libre-127-e",
    original_price: 2280000,
    discount_price: 1232000,
    discount_percentage: 46,
    is_sale: true,
    price: 1232000,
    formatted_price: "Rp 1.232.000",
    average_rating: 5.0,
    total_sold: 40,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-002",
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdXCm9Sc4NMzfrxLdXS54oKclpcxYgRwyq4m94EcAvA.webp",
      alt_text: "LIBRE 127 E",
    },
    category: { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
    series: null,
  },
  {
    id: "prod-003",
    name: "Meja Kerja Meja Belajar LIBRE 122 RIVIERA - WHITE",
    slug: "meja-kerja-libre-122-riviera-white",
    original_price: 1714000,
    discount_price: 1137000,
    discount_percentage: 34,
    is_sale: true,
    price: 1137000,
    formatted_price: "Rp 1.137.000",
    average_rating: 4.8,
    total_sold: 15,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-003",
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/Ldjp9MqfzHkNXmLdXtOCTqjUqzfrKQpAxtrrX5FQFQ.webp",
      alt_text: "LIBRE 122",
    },
    category: { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
    series: null,
  },
  {
    id: "prod-004",
    name: "Meja Sudut Meja Kerja Meja Komputer Meja Belajar - Stuva Desk",
    slug: "meja-sudut-stuva-desk",
    original_price: 3058000,
    discount_price: 1421000,
    discount_percentage: 53,
    is_sale: true,
    price: 1421000,
    formatted_price: "Rp 1.421.000",
    average_rating: 4.9,
    total_sold: 500,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-004",
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdXyUmiudNzvhQcLdXNysAaxX2TnQ1TTuondpTDGJ38w.webp",
      alt_text: "Stuva Desk",
    },
    category: { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
    series: null,
  },
  {
    id: "prod-005",
    name: "Stand TV Rak Penyimpanan Dayana TV White-SOL",
    slug: "stand-tv-dayana-tv-white-sol",
    original_price: 1532000,
    discount_price: 702000,
    discount_percentage: 54,
    is_sale: false,
    price: 702000,
    formatted_price: "Rp 702.000",
    average_rating: 4.8,
    total_sold: 85,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-005",
      url: "https://cf.shopee.co.id/file/id-11134207-7r98x-ll4ehx1nlw15b1",
      alt_text: "Dayana TV",
    },
    category: { id: "cat-004", name: "Meja TV", slug: "meja-tv" },
    series: null,
  },
  {
    id: "prod-006",
    name: "Meja Kerja lebar aestetik VOSS desk riviera - white",
    slug: "meja-kerja-voss-desk-riviera-white",
    original_price: 1713000,
    discount_price: 899000,
    discount_percentage: 48,
    is_sale: false,
    price: 899000,
    formatted_price: "Rp 899.000",
    average_rating: 4.7,
    total_sold: 120,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-006",
      url: "https://cf.shopee.co.id/file/id-11134207-7qukz-lhfp0qr5jkr2c9",
      alt_text: "VOSS desk",
    },
    category: { id: "cat-001", name: "Meja Kerja", slug: "meja-kerja" },
    series: null,
  },
  {
    id: "prod-007",
    name: "Meja Tamu Meja Kopi Kaki Besi - Xander Coffee Table 100 cm",
    slug: "meja-tamu-xander-coffee-table-100-cm",
    original_price: 2518000,
    discount_price: 711000,
    discount_percentage: 72,
    is_sale: false,
    price: 711000,
    formatted_price: "Rp 711.000",
    average_rating: 4.9,
    total_sold: 210,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-007",
      url: "https://cf.shopee.co.id/file/sg-11134201-7rd5o-m793mdr9avowb7",
      alt_text: "Xander Coffee Table",
    },
    category: { id: "cat-005", name: "Meja Tamu", slug: "meja-tamu" },
    series: null,
  },
  {
    id: "prod-008",
    name: "Lemari serbaguna sideboard Amaryllis Sb V1 Bianco-W",
    slug: "lemari-serbaguna-amaryllis-sb-v1-bianco-w",
    original_price: 3416000,
    discount_price: 1249000,
    discount_percentage: 63,
    is_sale: false,
    price: 1249000,
    formatted_price: "Rp 1.249.000",
    average_rating: 5.0,
    total_sold: 65,
    origin_city: "Malang",
    thumbnail: {
      id: "thumb-008",
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdKPHRvE6ztVhlwLdKegYiRc8E9JawSzupuRjLBlElsg.webp",
      alt_text: "Amaryllis Sb",
    },
    category: { id: "cat-002", name: "Lemari Buffet", slug: "lemari-buffet" },
    series: null,
  },
];

// Helper Format Rupiah
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

// Sub-komponen Hero Carousel (Handle 1 atau banyak item hero secara dinamis)
function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const sortedSlides = [...slides].sort((a, b) => a.sort_order - b.sort_order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedSlides.length);
  }, [sortedSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedSlides.length) % sortedSlides.length);
  }, [sortedSlides.length]);

  // Autoplay setiap 5 detik (jika slide > 1 & tidak di-hover)
  useEffect(() => {
    if (sortedSlides.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 20000);

    return () => clearInterval(interval);
  }, [sortedSlides.length, isHovered, nextSlide]);

  if (sortedSlides.length === 0) return null;

  return (
    <section 
      className="bg-white p-3 md:p-5 rounded-lg mb-5 shadow-sm relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full min-h-[360px] md:min-h-[580px] relative rounded-md overflow-hidden bg-gray-900">
        {sortedSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center text-center p-4 md:p-8 bg-cover bg-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("${slide.image}")`,
              }}
            >
              {slide.eyebrow && (
                <span className="text-secondary font-semibold text-xs md:text-sm tracking-wider uppercase mb-2 animate-fadeIn">
                  {slide.eyebrow}
                </span>
              )}
              <h1 className="text-white font-extrabold text-xl md:text-3xl max-w-[850px] leading-snug mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-xs md:text-base max-w-[750px] mb-6 font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                <a
                  href={slide.button_url}
                  className="bg-secondary text-white px-7 py-3 rounded font-bold cursor-pointer shadow-lg hover:bg-opacity-90 transition text-sm text-center"
                >
                  {slide.button_text}
                </a>
                <a
                  href="/produk"
                  className="bg-white/15 text-white border-2 border-white px-6 py-2.5 rounded font-bold cursor-pointer hover:bg-white/25 transition backdrop-blur-sm text-sm text-center"
                >
                  Lihat Katalog Pabrik
                </a>
              </div>
            </div>
          );
        })}

        {/* Panah Navigasi Prev/Next (Muncul jika slides > 1) */}
        {sortedSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 focus:outline-none"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 focus:outline-none"
              aria-label="Next Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator (Muncul jika slides > 1) */}
        {sortedSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {sortedSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-7 bg-secondary" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Sub-komponen Card Produk Reusable
function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.discount_price > 0 ? product.discount_price : product.price;

  return (
    <a
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
    </a>
  );
}

export default function Index() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = dummyCategoriesData;
  const seriesList = dummySeriesData;

  const popularProducts = rawProducts.filter((p) => p.is_sale);
  const mainCollectionProducts = rawProducts.filter((p) => !p.is_sale);

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

        {/* Section Sertifikasi */}
        <section className="bg-white border-b border-borderColor py-3.5 md:py-4 mb-5">
          <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-2 sm:gap-4 items-center">
            <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
              <img 
                src="/assets/img/download (2).png" 
                alt="ISO 9001 Certified" 
                className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
                  ISO 9001 Certified
                </span>
                <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
                  Cert No. ID02/16479
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
              <img 
                src="/assets/img/SVLK-LOGO-INDONESIA 2.png" 
                alt="Material Ramah Lingkungan" 
                className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
                  Material Ramah Lingkungan
                </span>
                <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
                  SVLK No. VLK00147
                </span>
              </div>
            </div>

            <div className="col-span-2 justify-self-center lg:col-span-1 lg:justify-self-auto flex items-center gap-2 sm:gap-3 justify-start lg:justify-center">
              <img 
                src="/assets/img/TKDN.png" 
                alt="Bangga Buatan Indonesia" 
                className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-textDark leading-tight">
                  Bangga Buatan Indonesia
                </span>
                <span className="text-[10px] sm:text-[11px] md:text-xs text-textMuted leading-tight mt-0.5">
                  Produk Asli Dalam Negeri
                </span>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-[1200px] mx-auto px-4">
          {/* Component Hero Carousel (Otomatis & Dynamic) */}
          <HeroCarousel slides={dummyHeroData} />

          <PromoCarousel />

          {/* Mobile Search & Filter Button */}
          <div className="flex md:hidden gap-2 mb-5 w-full">
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="Cari meja, lemari, rak..."
                className="w-full px-3 py-2 border border-gray-300 rounded-l text-sm focus:border-primary focus:outline-none bg-white"
              />
              <button className="bg-primary text-white px-4 rounded-r text-sm">Cari</button>
            </div>
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
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                onClick={() => setIsFilterOpen(false)}
              />
            )}

            <aside
              className={`fixed inset-y-0 right-0 w-[280px] bg-white p-5 z-50 transform transition-transform duration-300 ease-in-out border-l border-borderColor overflow-y-auto 
                ${isFilterOpen ? "translate-x-0" : "translate-x-full"}
                md:relative md:translate-x-0 md:w-[250px] md:p-5 md:rounded-lg md:h-fit md:shadow-sm md:border md:z-10 shrink-0`}
            >
              <div className="flex md:hidden justify-between items-center mb-6 pb-2 border-b border-borderColor">
                <span className="font-bold text-primary">Filter &amp; Kategori</span>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-textMuted hover:text-textDark text-2xl font-bold leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Kategori */}
              <div className="mb-6">
                <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
                  Kategori Produk
                </div>
                <ul className="flex flex-col gap-1">
                  {categories.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`/produk?kategori=${item.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                      >
                        <span>{item.name}</span>
                        <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Series */}
              <div className="mb-6">
                <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
                  Series Produk
                </div>
                <ul className="flex flex-col gap-1">
                  {seriesList.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`/produk?series=${item.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                      >
                        <span>{item.name}</span>
                        <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Program Spesial */}
              <div>
                <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-textMuted mb-3 pl-2">
                  Program Spesial
                </div>
                <ul className="flex flex-col gap-1">
                  {specialPrograms.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="flex items-center justify-between px-3 py-2.5 text-xs md:text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-[#F1F3F5] transition group"
                      >
                        <span>{item.name}</span>
                        <span className="text-lg text-gray-400 group-hover:text-primary leading-none">›</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Content Produk Utama */}
            <div className="flex-1">
              {popularProducts.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                    <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">
                      Rekomendasi Populer
                    </div>
                    <a href="/produk" className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition">
                      Lihat Semua →
                    </a>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                    {popularProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}

              {mainCollectionProducts.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                    <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">
                      Semua Koleksi Furnitur Terbaik
                    </div>
                    <a href="/produk" className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition">
                      Lihat Semua →
                    </a>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                    {mainCollectionProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
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