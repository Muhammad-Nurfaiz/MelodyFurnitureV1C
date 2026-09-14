'use client';

import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css, js } from "@/legacy/cart.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, Product } from "@/components/ProductCard";

// Mock data rekomendasi produk
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

export default function CartPage() {
  return (
    <LegacyPage
      theme="admin"
      css={css}
      js={js}
      bodyClassName="bg-[#f8f9ff] text-on-surface antialiased min-h-screen flex flex-col"
    >
      <>
        <Navbar />

        <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 md:py-10 flex-grow">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary mb-6 md:mb-8">
            Keranjang Belanja
          </h1>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">
            
            {/* Left Section: Item List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-xl border border-border-subtle divide-y divide-border-subtle shadow-sm overflow-hidden">
                
                {/* Item 1 */}
                <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4 md:gap-6">
                  <div className="pt-2 sm:pt-4">
                    <input
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer transition-colors"
                      type="checkbox"
                    />
                  </div>

                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle">
                    <img
                      alt="Meja Tv Stand Yoffy TV 150"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      src="https://cf.shopee.co.id/file/id-11134207-7r98o-ll1kfmblnd3s3b"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between gap-3 min-h-[5rem] sm:min-h-[7rem]">
                    <div className="flex flex-col md:flex-row md:justify-between gap-1 md:gap-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-textDark leading-snug line-clamp-2">
                        Meja Tv Stand Yoffy TV 150
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-secondary whitespace-nowrap">
                        Rp 1.250.000
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        className="text-textMuted hover:text-red-500 transition-colors p-1 flex items-center gap-1 text-xs font-semibold"
                        aria-label="Hapus Item"
                      >
                        <span className="material-symbols-outlined text-lg sm:text-xl">
                          delete
                        </span>
                        <span className="hidden sm:inline">Hapus</span>
                      </button>

                      <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden bg-bgLight">
                        <button className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm">
                          -
                        </button>
                        <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm text-textDark font-bold min-w-[32px] sm:min-w-[40px] text-center">
                          1
                        </span>
                        <button className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4 md:gap-6">
                  <div className="pt-2 sm:pt-4">
                    <input
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer transition-colors"
                      type="checkbox"
                    />
                  </div>

                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle">
                    <img
                      alt="Rak buku Serbaguna Pembatas Ruangan Zaid Bookcase"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      src="https://brdsg.com/img/600/bw5d48ohbw5elgecxb_3/CacZfNYpym4eHOuCac6SSHVbxqvVjSLK80y1SEOYCJg.webp"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between gap-3 min-h-[5rem] sm:min-h-[7rem]">
                    <div className="flex flex-col md:flex-row md:justify-between gap-1 md:gap-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-textDark leading-snug line-clamp-2">
                        Rak buku Serbaguna Pembatas Ruangan Zaid Bookcase
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-bold text-secondary whitespace-nowrap">
                        Rp 3.450.000
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        className="text-textMuted hover:text-red-500 transition-colors p-1 flex items-center gap-1 text-xs font-semibold"
                        aria-label="Hapus Item"
                      >
                        <span className="material-symbols-outlined text-lg sm:text-xl">
                          delete
                        </span>
                        <span className="hidden sm:inline">Hapus</span>
                      </button>

                      <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden bg-bgLight">
                        <button className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm">
                          -
                        </button>
                        <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm text-textDark font-bold min-w-[32px] sm:min-w-[40px] text-center">
                          1
                        </span>
                        <button className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Section: Order Summary */}
            <div className="lg:col-span-3 w-full">
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-border-subtle lg:sticky lg:top-28 shadow-sm">
                <h2 className="text-base md:text-lg font-bold text-textDark mb-4">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 mb-4 border-b border-border-subtle pb-4 text-xs sm:text-sm font-medium">
                  <div className="flex justify-between items-center text-textMuted">
                    <span>Total Harga (2 barang)</span>
                    <span className="text-textDark font-semibold">
                      Rp 4.700.000
                    </span>
                  </div>
                </div>

                <div className="pt-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-bold text-textDark">
                      Total Harga
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-extrabold text-secondary">
                      Rp 4.700.000
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <a
                    href="/checkout"
                    className="flex w-full justify-center items-center bg-secondary text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg transform active:scale-[0.99]"
                  >
                    Lanjut ke Pembayaran
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Section Rekomendasi */}
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
        </main>

        <Footer />
        <ChatWidget />
      </>
    </LegacyPage>
  );
}