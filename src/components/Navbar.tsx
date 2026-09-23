'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { DesktopNavLinks, MobileNavToggle } from "./SiteNav";
import { initGuestSession } from "@/lib/guestSession";

interface NavbarProps {
  cartCount?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://187.53.138.70:8081";

export function Navbar({ cartCount: initialCartCount }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState<number>(initialCartCount ?? 0);

  // Fetch Total Item dari API Cart
  const fetchCartCount = async () => {
    try {
      let guestToken = typeof window !== "undefined" ? localStorage.getItem("guest_session_id") : null;
      if (!guestToken) {
        guestToken = await initGuestSession();
      }

      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          ...(guestToken && { "X-Guest-Session-Id": guestToken }),
        },
      });

      if (res.ok) {
        const json = await res.json();
        // Mengutamakan total_items
        const count = json.data?.total_items ?? json.data?.items?.length ?? 0;
        setTotalItems(count);
      }
    } catch (err) {
      console.error("Gagal mengambil jumlah item keranjang:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Listen event kustom 'cart-updated'
    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/produk");
    }
  };

  return (
    <header id="mainHeader" className="bg-white border-b border-borderColor sticky top-0 z-40 shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-white text-xs py-2">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between">
          <div>Melody Furniture Resmi - Standar Internasional</div>
          <div>Lacak Pesanan | Hubungi Kami | Pengiriman Seluruh Indonesia</div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1200px] mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-4">
        <MobileNavToggle />
        <Link href="/" className="shrink-0">
          <img
            src="/assets/img/LOGO MELODY BARU.png"
            alt="Melody Furniture Logo"
            className="w-[160px] sm:w-36 md:w-[190px] h-auto"
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            id="searchDesktop"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari furnitur impian Anda (misal: Meja Belajar, Rak TV, Lemari)..."
            className="w-full px-4 py-2 border-2 border-primary rounded-l focus:outline-none text-base"
          />
          <button
            type="submit"
            id="btnSearchDesktop"
            className="bg-primary text-white px-5 rounded-r hover:bg-opacity-90 transition font-medium shrink-0"
          >
            Cari
          </button>
        </form>

        {/* Actions / Cart */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/cart"
            className="relative p-2 text-textDark hover:text-primary transition-colors group"
            aria-label="Keranjang Belanja"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {/* Badge hanya tampil jika totalItems > 0 */}
            {totalItems > 0 && (
              <span
                id="cartBadge"
                className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-secondary rounded-full transform translate-x-1 -translate-y-0.5 min-w-[18px]"
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Links Bar */}
      {/* <DesktopNavLinks /> */}
    </header>
  );
}