'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css, js } from "@/legacy/cart.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";
import { requestWithGuestSession } from "@/lib/guestSession";

// Interface untuk response API Cart
interface CartItem {
  id: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    stock: number;
    is_sale: boolean;
  };
}

interface CartData {
  id: string;
  total_items: number;
  total_quantity: number;
  subtotal: number;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(true);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Helper Format Rupiah
  const formatRupiah = (val: number | string) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://187.53.138.70:8081";

  // Helper untuk normalisasi URL gambar
  const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder.jpg"; // Gambar fallback jika path kosong
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // Menghilangkan slash ganda jika path diawali dengan '/'
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // 1. Fetch Cart Data
  const fetchCart = async () => {
    setLoadingCart(true);

    try {
      const res = await requestWithGuestSession(
        `${API_BASE_URL}/api/cart`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.data) {
        setCart(json.data);

        setSelectedItemIds(
          json.data.items.map((item: CartItem) => item.id)
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data keranjang:", err);
    } finally {
      setLoadingCart(false);
    }
  };

  const selectedItems =
    cart?.items.filter((item) =>
      selectedItemIds.includes(item.id)
    ) ?? [];

  const selectedTotalQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const selectedSubtotal = selectedItems.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  // 2. Update Quantity Item
  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;

    try {
      const res = await requestWithGuestSession(
        `${API_BASE_URL}/api/cart/items/${itemId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ quantity: newQty }),
        }
      );

      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Gagal mengubah kuantitas:", err);
    }
  };

  // 3. Delete Item
  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await requestWithGuestSession(
        `${API_BASE_URL}/api/cart/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchCart();

        // Dispatch event agar Navbar memperbarui badge count
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err) {
      console.error("Gagal menghapus item:", err);
    }
  };

  // Fetch Recommendations
  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      // 1. Hapus parameter limit=4 dari URL
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          "Accept": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      
      // Ambil array produk
      const productsData = json.data?.data || json.data || json || [];
      
      // 2. Simpan semua data tanpa .slice(0, 4)
      setRecommendations(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Gagal mengambil rekomendasi produk:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchRecommendations();
  }, []);

  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      return;
    }

    localStorage.setItem(
      "melody_checkout_selected_item_ids",
      JSON.stringify(selectedItemIds)
    );

    window.location.href = "/checkout";
  };

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
                {loadingCart ? (
                  <div className="p-8 text-center text-textMuted text-sm">
                    Memuat keranjang belanja...
                  </div>
                ) : !cart || cart.items.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-textMuted text-sm mb-4">Keranjang belanja kamu masih kosong.</p>
                    <Link
                      href="/produk"
                      className="inline-block px-5 py-2.5 bg-primary text-white font-bold rounded-lg text-xs"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div key={item.id} className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4 md:gap-6">
                      <div className="pt-2 sm:pt-4">
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={(e) => {
                            setSelectedItemIds((current) =>
                              e.target.checked
                                ? [...current, item.id]
                                : current.filter((id) => id !== item.id)
                            );
                          }}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer transition-colors"
                        />
                      </div>

                      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden border border-border-subtle">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          src={getImageUrl(item.product.thumbnail)}
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between gap-3 min-h-[5rem] sm:min-h-[7rem]">
                        <div className="flex flex-col md:flex-row md:justify-between gap-1 md:gap-4">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-textDark leading-snug line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg font-bold text-secondary whitespace-nowrap">
                            {formatRupiah(item.subtotal)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-textMuted hover:text-red-500 transition-colors p-1 flex items-center gap-1 text-xs font-semibold"
                            aria-label="Hapus Item"
                          >
                            <span className="material-symbols-outlined text-lg sm:text-xl">
                              delete
                            </span>
                            <span className="hidden sm:inline">Hapus</span>
                          </button>

                          <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden bg-bgLight">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm"
                            >
                              -
                            </button>
                            <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm text-textDark font-bold min-w-[32px] sm:min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 sm:px-3 py-1 hover:bg-neutral-200 transition-colors text-textDark font-semibold text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                    <span className="text-textMuted">
                      Total Harga ({selectedTotalQuantity} barang)
                    </span>
                    <span className="text-textDark font-semibold">
                      {formatRupiah(selectedSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-bold text-textDark">
                      Total Harga
                    </span>
                    <span className="text-base sm:text-lg md:text-xl font-extrabold text-secondary">
                      {formatRupiah(selectedSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={
                      !cart ||
                      cart.items.length === 0 ||
                      selectedItemIds.length === 0
                    }
                    className={`flex w-full justify-center items-center bg-secondary text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-opacity-95 transition-all shadow-md hover:shadow-lg transform active:scale-[0.99] ${
                      !cart ||
                      cart.items.length === 0 ||
                      selectedItemIds.length === 0
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    Lanjut ke Pembayaran
                  </button>
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

            {loadingRecs ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {/* Diubah dari 4 menjadi 8 atau sesuaikan untuk skeleton */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {recommendations.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </section>
        </main>

        <Footer />
        <ChatWidget />
      </>
    </LegacyPage>
  );
}