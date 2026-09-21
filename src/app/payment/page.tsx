'use client';

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LegacyPage } from "@/components/LegacyPage";
import { css, js } from "@/legacy/payment.legacy";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const trackingToken = searchParams.get("tracking_token");
  const fromMidtrans = searchParams.get("from_midtrans") === "1";
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentExpiredAt, setPaymentExpiredAt] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number>(0);

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

  useEffect(() => {
    let cancelled = false;

    async function loadPayment() {
      if (!trackingToken) {
        setPaymentError("Token pembayaran tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setPaymentError("");

        /*
        * Jika customer baru saja kembali dari Midtrans,
        * jangan redirect lagi ke Snap.
        * Ambil status pembayaran dari Payment Result.
        */
        if (fromMidtrans) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/result/${encodeURIComponent(
              trackingToken
            )}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const result = await response.json();

          if (cancelled) return;

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Gagal mengambil hasil pembayaran."
            );
          }

          const paymentResult = result?.data;

          if (!paymentResult) {
            throw new Error(
              "Data hasil pembayaran tidak ditemukan."
            );
          }

          setPaymentStatus(paymentResult.status ?? "pending");

          setIsPaid(
            paymentResult.status === "paid"
          );

          setLoading(false);
          return;
        }

        /*
        * Kunjungan pertama:
        * ambil informasi pembayaran dan,
        * jika masih bisa dibayar, arahkan ke Midtrans.
        */
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/resume/${encodeURIComponent(
            trackingToken
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Gagal mengambil informasi pembayaran."
          );
        }

        const payment = result?.data;

        if (!payment) {
          throw new Error(
            "Data pembayaran tidak ditemukan."
          );
        }

        setPaymentExpiredAt(
          payment.expired_at ?? null
        );

        setPaymentStatus(
          payment.payment_status ?? "pending"
        );

        setTotalPayment(
          Number(payment.total_payment) || 0
        );

        if (payment.payment_status === "paid") {
          setIsPaid(true);
          setLoading(false);
          stopAllLegacyTimers();
          return;
        }

        if (payment.can_pay && payment.redirect_url) {
          window.location.href = payment.redirect_url;
          return;
        }

        throw new Error(
          "Pembayaran tidak dapat dilanjutkan. Silakan cek status pesanan Anda."
        );
      } catch (error) {
        if (cancelled) return;

        setPaymentError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat pembayaran."
        );

        setLoading(false);
      }
    }

    loadPayment();

    return () => {
      cancelled = true;
    };
  }, [trackingToken, fromMidtrans]);

  const checkPaymentResult = async () => {
    if (!trackingToken) {
      setPaymentError("Token pembayaran tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setPaymentError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/result/${encodeURIComponent(
          trackingToken
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Gagal mengecek hasil pembayaran."
        );
      }

      const paymentResult = result?.data;

      if (!paymentResult) {
        throw new Error("Hasil pembayaran tidak ditemukan.");
      }

      setPaymentStatus(paymentResult.status);

      if (paymentResult.status === "paid") {
        setIsPaid(true);
        stopAllLegacyTimers();
      }

      return paymentResult;
    } catch (error) {
      console.error("Gagal mengecek hasil pembayaran:", error);

      setPaymentError(
        error instanceof Error
          ? error.message
          : "Gagal mengecek hasil pembayaran."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number | null) => {
    if (seconds === null) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  };

  const formatExpiredAt = (value: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckPayment = async () => {
    if (!trackingToken) return;

    try {
      setLoading(true);
      setPaymentError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/result/${encodeURIComponent(
          trackingToken
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Gagal mengecek status pembayaran."
        );
      }

      const paymentResult = result?.data;

      setPaymentStatus(
        paymentResult?.status ?? "pending"
      );

      setIsPaid(
        paymentResult?.status === "paid"
      );
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Gagal mengecek status pembayaran."
      );
    } finally {
      setLoading(false);
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
                {isPaid
                  ? "check_circle"
                  : paymentStatus === "expired"
                  ? "error"
                  : "pending"}
              </span>
            </div>
            
            <h1
              id="status-heading"
              className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight transition-all"
            >
              {isPaid
                ? "Pembayaran Berhasil!"
                : paymentStatus === "expired"
                  ? "Pembayaran Kedaluwarsa"
                  : paymentStatus === "cancelled"
                    ? "Pembayaran Dibatalkan"
                    : paymentStatus === "failed"
                      ? "Pembayaran Gagal"
                      : "Menunggu Pembayaran"}
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

          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-700">
                {paymentError}
              </p>
            </div>
          )}

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
                    className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                      remainingSeconds === 0
                        ? "text-red-600"
                        : "text-secondary"
                    }`}
                    id="countdown"
                  >
                    {formatCountdown(remainingSeconds)}
                  </div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                  <p className="text-[11px] sm:text-xs text-textMuted font-medium leading-relaxed">
                    {remainingSeconds === 0
                      ? "Batas waktu pembayaran telah berakhir."
                      : "Status pembayaran akan otomatis diperbarui setelah transaksi terverifikasi."}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-bold text-primary">
                    {formatExpiredAt(paymentExpiredAt)} WIB
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
                {formatCurrency(totalPayment)}
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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 relative z-20">
            {paymentError ? (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-secondary text-white h-11 sm:h-12 md:h-14 px-4 sm:px-5 rounded-xl font-bold hover:bg-opacity-95 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center text-xs sm:text-sm md:text-base tracking-wide cursor-pointer"
              >
                Coba Lagi
              </button>
            ) : isPaid ? (
              <Link
                href={`/track?tracking_token=${encodeURIComponent(
                  trackingToken ?? ""
                )}`}
                className="w-full bg-primary text-white h-11 sm:h-12 md:h-14 px-4 sm:px-5 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.98] shadow-sm transition-all flex items-center justify-center text-xs sm:text-sm md:text-base tracking-wide gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  local_shipping
                </span>
                Lihat Pesanan
              </Link>
            ) : (
              <div className="w-full bg-secondary text-white h-11 sm:h-12 md:h-14 px-4 sm:px-5 rounded-xl font-bold shadow-sm flex items-center justify-center text-xs sm:text-sm md:text-base tracking-wide">
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Menyiapkan Pembayaran...
                </span>
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
    </LegacyPage>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageContent />
    </Suspense>
  );
}