'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css, js } from "@/legacy/payment.legacy";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Fungsi helper untuk menyapu bersih seluruh setInterval & setTimeout legacy
  const stopAllLegacyTimers = () => {
    let id = window.setTimeout(() => {}, 0);
    while (id--) {
      window.clearTimeout(id);
      window.clearInterval(id);
    }
  };

  // Bersihkan timer otomatis saat komponen di-unmount (pindah ke /track atau halaman lain)
  useEffect(() => {
    return () => {
      stopAllLegacyTimers();
    };
  }, []);

  // Handler dummy: Tunggu 3 detik lalu ubah status ke Berhasil
  const handleCheckPaymentStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading || isPaid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsPaid(true);

      // Hentikan script timer countdown legacy langsung saat pembayaran berhasil
      stopAllLegacyTimers();
    }, 3000);
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
      <main className="flex-grow py-6 sm:py-10 md:py-14 px-4 sm:px-6 md:px-8 max-w-lg md:max-w-2xl mx-auto w-full relative z-10">
        <div className="space-y-4 sm:space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-4 sm:mb-8">
            <div
              id="icon-container"
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors duration-500 ${
                isPaid ? "bg-emerald-100" : "bg-amber-100"
              }`}
            >
              <span
                id="status-icon"
                className={`material-symbols-outlined text-[32px] sm:text-[40px] transition-all duration-300 ${
                  isPaid ? "text-emerald-600" : "text-amber-600"
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPaid ? "check_circle" : "pending"}
              </span>
            </div>
            
            <h1
              id="status-heading"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight transition-all"
            >
              {isPaid ? "Pembayaran Berhasil!" : "Menunggu Pembayaran"}
            </h1>
            
            <p
              id="status-desc"
              className="text-xs sm:text-sm md:text-base text-textMuted max-w-xs sm:max-w-md font-medium leading-relaxed transition-all"
            >
              {isPaid
                ? "Transaksi Anda telah terverifikasi. Pesanan sedang kami siapkan untuk dikirim."
                : "Pop-up Midtrans telah terbuka. Silakan selesaikan transaksi Anda sebelum batas waktu berakhir."}
            </p>
          </div>

          {/* Countdown Card (Hanya muncul jika belum dibayar) */}
          {!isPaid && (
            <div
              id="countdown-card"
              className="bg-white border border-border-subtle rounded-xl p-4 sm:p-6 md:p-8 minimal-shadow transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">
                    Selesaikan Pembayaran Dalam
                  </p>
                  <div
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-secondary tracking-tight"
                    id="countdown"
                  >
                    09:59
                  </div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                  <p className="text-[10px] sm:text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">
                    Batas Akhir Pembayaran
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-bold text-primary">
                    Kamis, 24 Okt 2024 - 14:30 WIB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total Pembayaran Card */}
          <div className="bg-white border border-border-subtle rounded-xl p-4 sm:p-6 md:p-8 minimal-shadow space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-borderColor pb-3 sm:pb-4">
              <span className="text-xs sm:text-sm md:text-base font-medium text-textMuted">Total Tagihan</span>
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-secondary" id="total-payment">
                Rp 2.450.123
              </span>
            </div>
            
            <div className="flex items-start gap-2.5 sm:gap-3 bg-bg-alt p-3 sm:p-4 rounded-lg border border-border-subtle">
              <span className="material-symbols-outlined text-primary text-[18px] sm:text-[20px] shrink-0 mt-0.5">
                {isPaid ? "verified" : "info"}
              </span>
              <p className="text-[11px] sm:text-xs text-textMuted font-medium leading-relaxed">
                {isPaid
                  ? "Bukti pembayaran telah dikirimkan secara otomatis ke email Anda."
                  : "Status pembayaran akan otomatis diperbarui begitu transaksi di Sandbox Midtrans terverifikasi."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 relative z-20">
            {!isPaid ? (
              <button
                type="button"
                onClick={handleCheckPaymentStatus}
                disabled={loading}
                className="w-full bg-secondary text-white h-11 sm:h-12 md:h-14 px-4 sm:px-5 rounded-xl font-bold hover:bg-opacity-95 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center text-xs sm:text-sm md:text-base tracking-wide cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Mengecek Status (3s)...
                  </span>
                ) : (
                  "Cek Status Pembayaran"
                )}
              </button>
            ) : (
              <Link
                href="/track"
                className="w-full bg-primary text-white h-11 sm:h-12 md:h-14 px-4 sm:px-5 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center text-xs sm:text-sm md:text-base tracking-wide gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">local_shipping</span>
                Lihat Pesanan
              </Link>
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
    </LegacyPage>
  );
}