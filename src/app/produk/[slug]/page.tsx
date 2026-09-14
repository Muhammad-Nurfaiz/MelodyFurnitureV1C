'use client';

import Link from "next/link";
import { use, useState, useRef, TouchEvent } from "react";
import { LegacyPage } from "@/components/LegacyPage";
import { css } from "@/legacy/detail-produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BreadcrumbSkeleton,
  PageHeadingSkeleton,
  ProductDetailSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";
import type { ReactNode } from "react";

// Helper Format Rupiah
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Interface Product untuk Komponen Card
export interface Product {
  id: string;
  name: string;
  slug: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number | null;
  is_sale: boolean;
  price: number;
  formatted_price?: string;
  average_rating: number;
  total_sold?: number;
  thumbnail?: {
    url: string;
    alt_text?: string;
  };
}

// Komponen ProductCard Universal
function ProductCard({ product }: { product: Product }) {
  const displayPrice =
    product.discount_price > 0 ? product.discount_price : product.price;

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

        {product.discount_percentage !== null &&
          product.discount_percentage > 0 && (
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

// Data Dummy Detail Produk Saat Ini
const productData = {
  name: "Meja TV RYUKI TV STAND RIVIERA Rustic Walnut",
  series: "ryuki", // Set ke null jika produk tidak memiliki series
  video_tutorial_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Set ke null jika tidak ada tutorial video
};

// Data Media Detail Produk
const mediaList = [
  {
    type: "video",
    url: "https://down-ws-id.vod.susercontent.com/api/v4/11110105/mms/id-11110105-6jt76-liv5i1rx3cv253.16003251711950497.mp4",
  },
  {
    type: "image",
    url: "https://down-id.img.susercontent.com/file/id-11134207-8224v-mg3dq7xthuz203.webp",
  },
  {
    type: "image",
    url: "https://down-id.img.susercontent.com/file/id-11134207-8224z-mg3dq7wdemtob2.webp",
  },
  {
    type: "image",
    url: "https://down-id.img.susercontent.com/file/id-11134207-82250-mg3dq7xtf1u626.webp",
  },
  {
    type: "image",
    url: "https://down-id.img.susercontent.com/file/id-11134207-8224y-mg3dq7wymrrjfc.webp",
  },
];

// Data Dummy Rekomendasi
const recommendationProducts: Product[] = [
  {
    id: "1",
    name: "Lemari Serbaguna Lemari Sideboard RYUKI SIDEBOARD RIVIERA EICHI",
    slug: "ryuki-sideboard",
    original_price: 3416000,
    discount_price: 1685000,
    discount_percentage: 50,
    is_sale: true,
    price: 1685000,
    formatted_price: "Rp 1.685.000",
    average_rating: 4.9,
    total_sold: 30,
    thumbnail: {
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdjLHL4h9lVwiIcLdmikNHu05JUCtRTC6OKxLtxrPbg.webp",
      alt_text: "Ryuki Sideboard",
    },
  },
  {
    id: "2",
    name: "Meja Sudut Meja Kerja Meja Komputer Meja Belajar - Stuva Desk",
    slug: "stuva-desk",
    original_price: 3058000,
    discount_price: 1421000,
    discount_percentage: 53,
    is_sale: true,
    price: 1421000,
    formatted_price: "Rp 1.421.000",
    average_rating: 4.8,
    total_sold: 100,
    thumbnail: {
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/LdXyUmiudNzvhQcLdXNysAaxX2TnQ1TTuondpTDGJ38w.webp",
      alt_text: "Stuva Desk",
    },
  },
  {
    id: "3",
    name: "Meja Kerja Meja Belajar LIBRE 122 RIVIERA - WHITE",
    slug: "libre-desk",
    original_price: 1714000,
    discount_price: 1137000,
    discount_percentage: 33,
    is_sale: false,
    price: 1137000,
    formatted_price: "Rp 1.137.000",
    average_rating: 5.0,
    total_sold: 15,
    thumbnail: {
      url: "https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/Ldjp9MqfzHkNXmLdXtOCTqjUqzfrKQpAxtrrX5FQFQ.webp",
      alt_text: "Libre Desk",
    },
  },
  {
    id: "4",
    name: "Laci Nakas Minimalis 40171 CETR 47 WHITE-GREY",
    slug: "cetr-nakas",
    original_price: 988000,
    discount_price: 540000,
    discount_percentage: 45,
    is_sale: true,
    price: 540000,
    formatted_price: "Rp 540.000",
    average_rating: 4.9,
    total_sold: 40,
    thumbnail: {
      url: "https://cf.shopee.co.id/file/sg-11134201-7rbm3-lo6cri7mkt5x77",
      alt_text: "Cetr Nakas",
    },
  },
];

function DetailMain({ children }: { children: ReactNode }) {
  const ready = useContentReady(650);
  return (
    <SkeletonOverlay ready={ready} skeleton={<ProductDetailSkeleton />}>
      {children}
    </SkeletonOverlay>
  );
}

function DetailHeading({ name }: { name: string }) {
  const ready = useContentReady(350);
  return (
    <SkeletonOverlay
      ready={ready}
      skeleton={
        <div className="space-y-3">
          <BreadcrumbSkeleton />
          <PageHeadingSkeleton />
        </div>
      }
    >
      <div className="space-y-3 md:space-y-4">
        <nav className="flex text-xs md:text-sm text-textMuted space-x-2">
          <Link className="hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="hover:text-primary transition-colors" href="/produk">
            Produk
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Buffet TV</span>
        </nav>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-3xl text-textDark">
          {name}
        </h1>
      </div>
    </SkeletonOverlay>
  );
}

export default function DetailProdukPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Carousel State & Touch Handler
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Lightbox States
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null);

  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>("spesifikasi");

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleMediaClick = (item: { type: string; url: string }) => {
    if (item.type === "video") {
      setLightboxVideo(item.url);
    } else {
      setLightboxImage(item.url);
    }
  };

  return (
    <LegacyPage
      theme="shop"
      css={css}
      js=""
      bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-[#Inter]"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <>
        <Navbar />
        <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
          <DetailMain>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div
                id="sidebarOverlay"
                className="fixed inset-0 bg-black/50 z-50 hidden opacity-0 transition-opacity duration-300 md:hidden"
              ></div>

              {/* SECTION MEDIA & THUMBNAIL CAROUSEL */}
              <div className="space-y-4 md:space-y-6">
                <div
                  id="heroMediaContainer"
                  className="relative bg-white rounded-lg overflow-hidden aspect-square border border-borderColor shadow-sm select-none cursor-pointer"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    id="heroViewport"
                    className="w-full h-full overflow-hidden touch-pan-y"
                  >
                    <div
                      id="heroTrack"
                      className="flex h-full transition-transform duration-300 ease-out will-change-transform"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {mediaList.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleMediaClick(item)}
                          className="hero-slide w-full h-full shrink-0 flex items-center justify-center bg-white relative group"
                        >
                          {item.type === "video" ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                              <video
                                className="max-w-full max-h-full"
                                autoPlay={true}
                                muted={true}
                                loop={true}
                                playsInline={true}
                              >
                                <source src={item.url} type="video/mp4" />
                              </video>
                            </div>
                          ) : (
                            <img
                              className="hero-image w-full h-full object-cover"
                              src={item.url}
                              alt={`Detail Media ${index}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tombol Chevron Desktop */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    type="button"
                    aria-label="Previous Slide"
                    className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    type="button"
                    aria-label="Next Slide"
                    className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>

                {/* List Thumbnail */}
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {mediaList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`media-thumb cursor-pointer bg-white rounded overflow-hidden aspect-square transition-all border-2 ${
                        currentIndex === index
                          ? "border-primary opacity-100 scale-[1.02]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.type === "video" ? (
                        <video
                          className="w-full h-full object-contain pointer-events-none"
                          muted={true}
                          preload="metadata"
                        >
                          <source src={item.url} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          className="w-full h-full object-cover thumbnail"
                          src={item.url}
                          alt={`Thumb ${index}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DETAIL INFORMASI PRODUK */}
              <div className="lg:sticky lg:top-28 self-start space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                  <DetailHeading name={productData.name} />

                  {/* Link Series Kondisional */}
                  {productData.series && (
                    <Link
                      href={`/produk?series=${productData.series}`}
                      className="inline-flex items-center gap-1.5 text-primary text-xs md:text-sm font-semibold hover:underline self-start"
                    >
                      <span>Lihat series lainnya</span>
                      <span className="material-symbols-outlined text-base md:text-lg">
                        arrow_forward
                      </span>
                    </Link>
                  )}

                  <div className="flex items-baseline space-x-3 md:space-x-4">
                    <p className="text-lg md:text-2xl font-bold text-secondary">
                      Rp 1.091.000
                    </p>
                    <span className="text-xs md:text-sm text-textMuted line-through">
                      Rp 1.515.000
                    </span>
                    <span className="bg-[#FFECE8] text-secondary px-2 py-0.5 rounded text-[10px] md:text-xs font-bold">
                      Promo 30%
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="inline-flex items-center gap-2 bg-[#E8F7EE] text-[#1B7F4C] px-3 py-1.5 rounded-full self-start">
                      <span className="material-symbols-outlined text-base md:text-lg">
                        inventory_2
                      </span>
                      <span className="text-xs md:text-sm font-bold">
                        Stok tersedia: 24 unit
                      </span>
                    </div>
                    <span className="text-[11px] md:text-xs text-textMuted">
                      Stok terbatas, siap kirim dari gudang Malang
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-textMuted leading-relaxed max-w-lg">
                    Ryuki TV Stand adalah Meja TV. Dilengkapi dengan 2 lemari
                    penyimpanan sliding dan 2 tempat kosong yang secara fungsi
                    dapat digunakan untuk menyimpan barang keperluan anda, di
                    desain minimalis dan soft looking, cocok di ruangan kekinian
                    anda. Tersedia dalam jumlah terbatas.
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-secondary text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-opacity-90 active:scale-[0.99] transition-all flex items-center justify-center space-x-2">
                      <span className="material-symbols-outlined">
                        shopping_cart
                      </span>
                      <span>Masukkan Keranjang</span>
                    </button>
                  </div>
                  <Link
                    href="/checkout"
                    className="w-full border-2 border-primary text-primary text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-primary hover:text-white active:scale-[0.99] transition-all text-center"
                  >
                    Beli Sekarang
                  </Link>

                  {/* Tombol Video Tutorial Pemasangan Kondisional */}
                  {productData.video_tutorial_url && (
                    <a
                      href={productData.video_tutorial_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-borderColor bg-white text-textDark text-xs md:text-sm font-medium py-3 rounded hover:bg-gray-50 hover:text-primary active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[#FF0000]">
                        play_circle
                      </span>
                      <span>Lihat Video Tutorial Pemasangan (YouTube)</span>
                    </a>
                  )}
                </div>

                {/* ACCORDION REFACTORING */}
                <div className="border-t border-borderColor pt-6 space-y-4">
                  {/* Item 1: Spesifikasi */}
                  <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAccordion("spesifikasi")}
                    >
                      <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary">
                          straighten
                        </span>
                        <span>Spesifikasi Produk</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${
                          openAccordion === "spesifikasi" ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {openAccordion === "spesifikasi" && (
                      <div className="px-4 pb-4 bg-white text-xs md:text-sm">
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between border-b border-borderColor pb-2">
                            <span className="text-textMuted">Dimensi</span>
                            <span className="font-medium">
                              159 x 39.6 x 48 cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textMuted">
                              Kapasitas Beban
                            </span>
                            <span className="font-medium">34.5 kg</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 2: Detail Material */}
                  <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAccordion("material")}
                    >
                      <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary">
                          inventory_2
                        </span>
                        <span>Detail Material</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${
                          openAccordion === "material" ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {openAccordion === "material" && (
                      <div className="px-4 pb-4 bg-white text-xs md:text-sm">
                        <div className="pt-2">
                          <ul className="space-y-2 text-textMuted">
                            <li className="flex items-start space-x-2">
                              <span className="text-secondary mt-1">•</span>
                              <span>Warna: Riviera - Rustic walnut</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-secondary mt-1">•</span>
                              <span>Finishing: Paper</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="text-secondary mt-1">•</span>
                              <span>
                                Semua produk kami bersertifikat dunia: ISO
                                Sertified 9001-2015, FSC, Indonesian Legal Wood
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item 3: Informasi Pengiriman */}
                  <div className="accordion-item border border-borderColor rounded overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAccordion("pengiriman")}
                    >
                      <span className="text-sm md:text-base font-bold text-textDark flex items-center space-x-3">
                        <span className="material-symbols-outlined text-primary">
                          local_shipping
                        </span>
                        <span>Informasi Pengiriman</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-textMuted transition-transform duration-300 ${
                          openAccordion === "pengiriman" ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {openAccordion === "pengiriman" && (
                      <div className="px-4 pb-4 bg-white text-xs md:text-sm">
                        <div className="grid grid-cols-1 gap-4 pt-2">
                          <div className="p-3 border border-borderColor rounded bg-bgLight">
                            <p className="text-xs text-textMuted mt-1">
                              PENGIRIMAN KE JAWA DAN DENPASAR MOHON PILIH ONGKOS
                              KIRIM 0 RUPIAH! GRATIS ONGKIR!!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION PRODUK REKOMENDASI */}
            <section className="mt-16 md:mt-24">
              <div className="flex justify-between items-center mb-6 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
                <div className="text-sm md:text-lg font-bold text-primary uppercase tracking-wide">
                  Produk Rekomendasi
                </div>
                <Link
                  href="/produk"
                  className="text-secondary no-underline text-xs md:text-sm font-medium hover:opacity-85 transition"
                >
                  Lihat Koleksi →
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {recommendationProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>
          </DetailMain>
        </main>

        <Footer />

        {/* LIGHTBOX GAMBAR */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-secondary transition-colors bg-black/40 hover:bg-black/60 p-2 rounded-full flex items-center justify-center z-50 focus:outline-none"
              aria-label="Tutup Mode Fokus"
            >
              <span className="material-symbols-outlined !text-3xl md:!text-4xl">
                close
              </span>
            </button>
            <div
              className="max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Mode Fokus Produk"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

        {/* LIGHTBOX VIDEO */}
        {lightboxVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center transition-opacity duration-300 p-4"
            onClick={() => setLightboxVideo(null)}
          >
            <button
              onClick={() => setLightboxVideo(null)}
              className="absolute top-5 right-5 text-white z-50 bg-black/40 hover:bg-black/60 p-2 rounded-full flex items-center justify-center"
              aria-label="Tutup Lightbox Video"
            >
              <span className="material-symbols-outlined !text-3xl md:!text-4xl">
                close
              </span>
            </button>

            <div
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
                controls={true}
                autoPlay={true}
                playsInline={true}
              >
                <source src={lightboxVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        )}

        <ChatWidget />
      </>
    </LegacyPage>
  );
}