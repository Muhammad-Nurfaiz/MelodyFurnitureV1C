'use client';

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { LegacyPage } from "@/components/LegacyPage";
import { css } from "@/legacy/detail-produk.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductAccordion } from "@/components/ProductAccordion";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import {
  BreadcrumbSkeleton,
  PageHeadingSkeleton,
  ProductDetailSkeleton,
  SkeletonOverlay,
  useContentReady,
} from "@/components/ContentSkeleton";
import { initGuestSession } from "@/lib/guestSession";
import { getImageUrl, formatRupiah } from "@/lib/utils";
import { Product, CategoryOrSeries } from "@/types";
import { getProductDetail, getProductRecommendations } from "@/services/api";
import type { ReactNode } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getSeriesInfo(series?: CategoryOrSeries | string | null) {
  if (!series) return null;
  if (typeof series === "object") {
    return { slug: series.slug, name: series.name || series.slug };
  }
  return { slug: series, name: series };
}

function DetailMain({ children, loading }: { children: ReactNode; loading: boolean }) {
  const ready = useContentReady(loading ? 99999 : 200);
  return (
    <SkeletonOverlay ready={ready} skeleton={<ProductDetailSkeleton />}>
      {children}
    </SkeletonOverlay>
  );
}

function DetailHeading({ name, categoryName, loading }: { name?: string; categoryName?: string; loading: boolean }) {
  const ready = useContentReady(loading ? 99999 : 200);
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
          <Link className="hover:text-primary transition-colors" href="/">Home</Link>
          <span>/</span>
          <Link className="hover:text-primary transition-colors" href="/produk">Produk</Link>
          {categoryName && (
            <>
              <span>/</span>
              <span className="text-primary font-medium">{categoryName}</span>
            </>
          )}
        </nav>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-xl md:text-3xl text-textDark">
          {name}
        </h1>
      </div>
    </SkeletonOverlay>
  );
}

export default function DetailProdukPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(true);

  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setLoadingRecs(true);
      setError(null);

      try {
        const productData = await getProductDetail(slug);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data produk.");
      } finally {
        setLoading(false);
      }

      try {
        const recs = await getProductRecommendations(slug);
        setRecommendations(recs);
      } catch (recErr) {
        console.error("Gagal mengambil produk rekomendasi:", recErr);
      } finally {
        setLoadingRecs(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product?.id) return;

    setAddingToCart(true);
    setToastMessage(null);

    try {
      let guestToken = localStorage.getItem("guest_session_id");
      if (!guestToken) {
        guestToken = await initGuestSession();
      }

      if (!guestToken) {
        throw new Error("Gagal menginisialisasi sesi. Silakan muat ulang halaman.");
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Guest-Session-Id": guestToken,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          guest_token: guestToken,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Gagal menambahkan produk ke keranjang");
      }

      window.dispatchEvent(new Event("cart-updated"));
      setToastMessage({
        type: "success",
        text: resData.message || "Produk berhasil ditambahkan ke keranjang!",
      });
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const mediaList =
    product?.media && product.media.length > 0
      ? product.media
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((m) => ({
            type: m.media_type || "image",
            url: getImageUrl(m.url),
            alt: m.alt_text || product.name,
          }))
      : [
          {
            type: "image",
            url: "/assets/img/placeholder.webp",
            alt: product?.name || "Product Placeholder",
          },
        ];

  const displayPrice = product
    ? product.discount_price > 0 ? product.discount_price : product.price
    : 0;

  const seriesInfo = getSeriesInfo(product?.series);

  return (
    <LegacyPage theme="shop" css={css} js="" bodyClassName="bg-bgLight text-textDark antialiased leading-relaxed font-[#Inter]">
      <>
        <Navbar />
        <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 text-center my-12">
              <span className="material-symbols-outlined text-4xl mb-2">error</span>
              <p className="font-semibold text-lg">{error}</p>
              <Link href="/produk" className="inline-block mt-4 bg-primary text-white px-4 py-2 rounded font-bold text-sm">
                Kembali ke Katalog
              </Link>
            </div>
          ) : (
            <DetailMain loading={loading}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* GALLERY COMPONENT */}
                <ProductGallery mediaList={mediaList} />

                {/* DETAIL & KONTROL PEMBELIAN */}
                <div className="lg:sticky lg:top-28 self-start space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <DetailHeading name={product?.name} categoryName={product?.category?.name} loading={loading} />

                    {seriesInfo?.slug && (
                      <Link href={`/produk?series=${encodeURIComponent(seriesInfo.slug)}`} className="inline-flex items-center gap-1.5 text-primary text-xs md:text-sm font-semibold hover:underline">
                        <span>Lihat series lainnya</span>
                        <span className="material-symbols-outlined text-base md:text-lg">arrow_forward</span>
                      </Link>
                    )}

                    <div className="flex items-baseline space-x-3 md:space-x-4">
                      <p className="text-lg md:text-2xl font-bold text-secondary">
                        {product?.formatted_price && product.formatted_price !== "Rp 0" ? product.formatted_price : formatRupiah(displayPrice)}
                      </p>
                      {product && product.original_price > displayPrice && (
                        <>
                          <span className="text-xs md:text-sm text-textMuted line-through">{formatRupiah(product.original_price)}</span>
                          {product.discount_percentage && product.discount_percentage > 0 && (
                            <span className="bg-[#FFECE8] text-secondary px-2 py-0.5 rounded text-[10px] md:text-xs font-bold">
                              Promo {product.discount_percentage}%
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="inline-flex items-center gap-2 bg-[#E8F7EE] text-[#1B7F4C] px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-base md:text-lg">inventory_2</span>
                        <span className="text-xs md:text-sm font-bold">Rating {product?.average_rating || 0} ⭐ | Terjual {product?.total_sold || 0}+</span>
                      </div>
                      {product && (
                        <span className={`text-xs md:text-sm font-medium px-2.5 py-1 rounded-full ${
                          (product.total_stock ?? 0) > 0 ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-red-50 text-red-600 border border-red-100"
                        }`}>
                          {(product.total_stock ?? 0) > 0 ? `Stok Tersedia: ${product.total_stock}` : "Stok Habis"}
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-textMuted leading-relaxed max-w-lg whitespace-pre-line">{product?.description}</p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product?.total_stock === 0 || addingToCart}
                      className="w-full bg-secondary text-white text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {addingToCart ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-base md:text-lg">progress_activity</span>
                          <span>Menambahkan...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">shopping_cart</span>
                          <span>Masukkan Keranjang</span>
                        </>
                      )}
                    </button>
                    <Link
                      href={
                        product?.id
                          ? `/checkout?mode=direct&product_id=${encodeURIComponent(
                              product.id
                            )}&slug=${encodeURIComponent(slug)}&quantity=1`
                          : "/checkout"
                      }
                      className={`w-full border-2 border-primary text-primary text-sm md:text-base font-bold py-3.5 md:py-4 rounded hover:bg-primary hover:text-white transition-all text-center ${
                        product?.total_stock === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      Beli Sekarang
                    </Link>
                    {product?.video_tutorial_url && (
                      <a
                        href={product.video_tutorial_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border border-borderColor bg-white text-textDark text-xs md:text-sm font-medium py-3 rounded hover:bg-gray-50 hover:text-primary active:scale-[0.99] transition-all flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[#FF0000]">play_circle</span>
                        <span>Lihat Video Tutorial Pemasangan (YouTube)</span>
                      </a>
                    )}
                  </div>

                  {/* ACCORDION COMPONENT */}
                  <ProductAccordion product={product} />
                </div>
              </div>

              {/* RECOMMENDATIONS COMPONENT */}
              <ProductRecommendations loading={loadingRecs} recommendations={recommendations} />
            </DetailMain>
          )}
        </main>

        <Footer />
        <ChatWidget />
        <Toast message={toastMessage} />
      </>
    </LegacyPage>
  );
}