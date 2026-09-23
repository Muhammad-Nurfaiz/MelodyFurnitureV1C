'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LegacyPage } from "@/components/LegacyPage";
import { css, js } from "@/legacy/track.legacy";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://187.53.138.70:8081/api";

export default function TrackSearchPage() {
  const router = useRouter();

  const [searchCode, setSearchCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedCode = searchCode.trim().toUpperCase();

    if (!cleanedCode) return;

    setIsSearching(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/tracking/${encodeURIComponent(cleanedCode)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Kode pesanan "${searchCode.trim()}" tidak ditemukan. Silakan periksa kembali kode Anda.`
          );
        }

        let message =
          "Terjadi kesalahan saat mencari pesanan. Silakan coba lagi.";

        try {
          const result = await response.json();

          if (result?.message) {
            message = result.message;
          }
        } catch {
          // Response bukan JSON.
        }

        throw new Error(message);
      }

      router.push(
        `/track?tracking_token=${encodeURIComponent(cleanedCode)}`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kode pesanan tidak ditemukan. Silakan periksa kembali kode Anda."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <LegacyPage
      theme="admin"
      css={css}
      js={js}
      bodyClassName="text-on-surface antialiased min-h-screen flex flex-col bg-slate-50/50"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <Navbar />

      <main className="flex-grow py-6 sm:py-10 md:py-14 px-4 sm:px-6 md:px-8 max-w-lg md:max-w-2xl mx-auto w-full relative z-10">
        <div className="space-y-6 sm:space-y-8">

          {/* Header & Judul */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Lacak Pesanan Anda
            </h1>

            <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto font-medium">
              Masukkan kode pesanan untuk memantau status dan perjalanan pesanan furniture Anda secara real-time.
            </p>
          </div>

          {/* Form Input Kode Tracking */}
          <div className="bg-white border border-border-subtle rounded-2xl p-4 sm:p-6 minimal-shadow space-y-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted text-[20px]">
                  search
                </span>

                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => {
                    setSearchCode(e.target.value);

                    if (errorMessage) {
                      setErrorMessage("");
                    }
                  }}
                  placeholder="Masukkan Kode Pesanan (contoh: 01M2Z214GTV5QTS...)"
                  className="w-full pl-10 pr-4 py-3 bg-bg-alt border border-border-subtle rounded-xl text-xs sm:text-sm font-semibold text-primary placeholder:text-textMuted/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 sm:h-auto px-6 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      local_shipping
                    </span>
                    <span>Lacak Pesanan</span>
                  </>
                )}
              </button>
            </form>

            {/* Notifikasi Box Merah Jika Resi Tidak Ditemukan */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0 mt-0.5">
                  error
                </span>

                <p className="font-medium leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Link Kembali Ke Beranda */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-textMuted hover:text-primary transition-colors inline-block py-1"
            >
              Kembali ke Beranda
            </Link>
          </div>

        </div>
      </main>

      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}