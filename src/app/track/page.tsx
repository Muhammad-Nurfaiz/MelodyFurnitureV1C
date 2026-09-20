'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LegacyPage } from "@/components/LegacyPage";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/track.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const normalizeImageUrl = (image: string | null) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

type TimelineItem = {
  status: string;
  title: string;
  description: string;
  created_at: string;
};

type OrderItem = {
  product_id: string;
  name: string;
  slug: string;
  image: string | null;
  quantity: number;
  unit_price: string;
  subtotal: string;
};

type TrackingData = {
  order: {
    id: string;
    order_number: string;
    tracking_token: string;
    status: string;
    status_label: string;
    payment_status: string;

    customer: {
      name: string;
      phone: string;
      email: string;
    };

    shipping: {
      courier: string;
      method: string;
      tracking_number: string | null;
      tracking_url: string | null;
      address: {
        recipient_name: string;
        phone: string;
        regency_id: string;
        city: string;
        province: string;
        address: string;
        area: string;
        postal_code: string;
      };
      packed_at: string | null;
      picked_up_at: string | null;
      shipped_at: string | null;
      completed_at: string | null;
    };

    payment: {
      method: string | null;
      status: string;
      snap_token: string | null;
      redirect_url: string | null;
      expired_at: string | null;
      paid_at: string | null;
      is_expired: boolean;
    };

    summary: {
      subtotal: string;
      voucher_discount: string;
      shipping_fee: string;
      original_shipping_fee: string;
      total_payment: string;
      total_weight: number;
    };

    items: OrderItem[];

    cancellation_request: {
      status: string;
      reason: string;
      previous_status: string;
      approved_by: string | null;
      approved_at: string | null;
      rejected_by: string | null;
      rejected_at: string | null;
      admin_notes: string | null;
      created_at: string;
      updated_at: string;
    } | null;

    refund: {
      refund_number: string;
      amount: string;
      status: string;
      bank_name: string | null;
      account_name: string | null;
      account_number: string | null;
      notes: string | null;
      requested_at: string | null;
      processed_at: string | null;
      completed_at: string | null;
    } | null;

    timeline: TimelineItem[];

    created_at: string;
    updated_at: string;
  };

  actions: {
    can_pay: boolean;
    can_request_cancel: boolean;
    can_track_shipping: boolean;
    can_download_invoice: boolean;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: TrackingData;
};

function formatRupiah(value: string | number): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string | null): string {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTimelineIcon(status: string): string {
  switch (status) {
    case "pending":
      return "receipt_long";

    case "paid":
      return "check_circle";

    case "processing":
      return "inventory";

    case "picked_up":
      return "local_shipping";

    case "shipped":
      return "local_shipping";

    case "completed":
      return "check_circle";

    case "req_cancel":
      return "pending_actions";

    case "cancelled":
      return "cancel";

    case "refund":
      return "currency_exchange";

    default:
      return "radio_button_checked";
  }
}

function isTimelineActive(
  timeline: TimelineItem[],
  index: number
): boolean {
  return index === 0;
}

export default function TrackPage() {
  const searchParams = useSearchParams();
  const trackingToken = searchParams.get("tracking_token");

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [downloading, setDownloading] = useState(false);

  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancellationError, setCancellationError] = useState("");
  const [cancellationSuccess, setCancellationSuccess] = useState("");

  const fetchTracking = async () => {
    if (!trackingToken) {
      setTracking(null);
      setErrorMessage(
        "Tracking token tidak ditemukan. Silakan buka halaman tracking dari pesanan Anda."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const guestSessionId =
        typeof window !== "undefined"
          ? localStorage.getItem("guest_session_id")
          : null;

      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (guestSessionId) {
        headers["X-Guest-Session-Id"] = guestSessionId;
      }

      const response = await fetch(
        `${API_BASE_URL}/tracking/${encodeURIComponent(trackingToken)}`,
        {
          method: "GET",
          headers,
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Data tracking tidak dapat diambil."
        );
      }

      setTracking(result.data);
    } catch (error) {
      console.error("Gagal mengambil data tracking:", error);

      setTracking(null);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data tracking."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [trackingToken]);

  const handleCopyAWB = async () => {
    const trackingNumber = tracking?.order.shipping.tracking_number;

    if (!trackingNumber) return;

    try {
      await navigator.clipboard.writeText(trackingNumber);
    } catch (error) {
      console.error("Gagal menyalin nomor resi:", error);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!tracking?.order.id) return;

    try {
      setDownloading(true);
      setErrorMessage("");

      const guestSessionId =
        typeof window !== "undefined"
          ? localStorage.getItem("guest_session_id")
          : null;

      const headers: HeadersInit = {
        Accept: "application/pdf",
      };

      if (guestSessionId) {
        headers["X-Guest-Session-Id"] = guestSessionId;
      }

      const response = await fetch(
        `${API_BASE_URL}/tracking/${encodeURIComponent(
          tracking.order.tracking_token
        )}/invoice`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        let message = "Invoice tidak dapat diunduh.";

        try {
          const result = await response.json();
          message = result?.message || message;
        } catch {
          // Response bukan JSON.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${tracking.order.order_number}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh invoice:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Invoice tidak dapat diunduh."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmitCancellation = async () => {
    const reason = cancellationReason.trim();

    if (reason.length < 5) {
      setCancellationError(
        "Alasan pembatalan minimal 5 karakter."
      );
      return;
    }

    if (!trackingToken) {
      setCancellationError("Tracking token tidak ditemukan.");
      return;
    }

    try {
      setCancelling(true);
      setCancellationError("");
      setCancellationSuccess("");

      const guestSessionId =
        typeof window !== "undefined"
          ? localStorage.getItem("guest_session_id")
          : null;

      const headers: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (guestSessionId) {
        headers["X-Guest-Session-Id"] = guestSessionId;
      }

      const response = await fetch(
        `${API_BASE_URL}/tracking/${encodeURIComponent(
          trackingToken
        )}/cancellation`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Pengajuan pembatalan gagal."
        );
      }

      setCancellationSuccess(
        result.message || "Pengajuan pembatalan berhasil dikirim."
      );

      setCancellationReason("");

      await fetchTracking();

      setTimeout(() => {
        setCancellationOpen(false);
        setCancellationSuccess("");
      }, 1200);
    } catch (error) {
      console.error("Gagal mengajukan pembatalan:", error);

      setCancellationError(
        error instanceof Error
          ? error.message
          : "Pengajuan pembatalan gagal."
      );
    } finally {
      setCancelling(false);
    }
  };

  const order = tracking?.order;
  const actions = tracking?.actions;

  return (
    <LegacyPage
      theme="admin"
      css={css}
      js={js}
      bodyClassName="text-on-background antialiased min-h-screen flex flex-col bg-slate-50/50"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      <Navbar />

      <main className="flex-grow py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="w-full">

          {loading && (
            <div className="bg-white border border-border-subtle rounded-xl p-8 minimal-shadow text-center">
              <div className="mx-auto w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />

              <p className="text-sm font-medium text-on-surface-variant">
                Memuat data pesanan...
              </p>
            </div>
          )}

          {!loading && errorMessage && (
            <div className="bg-white border border-red-200 rounded-xl p-6 sm:p-8 minimal-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">
                    error
                  </span>
                </div>

                <div>
                  <h1 className="text-base sm:text-lg font-bold text-primary">
                    Data Tracking Tidak Dapat Dimuat
                  </h1>

                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {errorMessage}
                  </p>

                  {trackingToken && (
                    <button
                      type="button"
                      onClick={fetchTracking}
                      className="mt-4 px-4 py-2.5 bg-primary text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-primary/90 transition"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && !errorMessage && order && tracking && actions && (
            <>
              {/* Header Card */}
              <div className="bg-white border border-border-subtle rounded-xl p-5 sm:p-6 md:p-8 mb-6 minimal-shadow">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight mb-1 sm:mb-2">
                      Track Your Order
                    </h1>

                    <p className="text-xs sm:text-sm font-medium text-on-surface-variant flex items-center gap-2">
                      Order ID:
                      <span className="text-primary font-bold">
                        #{order.order_number}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
                    <span className="bg-secondary-container text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide">
                      {order.status_label}
                    </span>

                    <p className="text-xs sm:text-sm font-medium text-on-surface-variant">
                      {order.shipping.tracking_number
                        ? "AWB: "
                        : "Nomor resi belum tersedia"}

                      {order.shipping.tracking_number && (
                        <span className="font-bold text-primary">
                          {order.shipping.tracking_number}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Timeline Delivery Detail */}
                <div className="lg:col-span-8 bg-white border border-border-subtle rounded-xl p-5 sm:p-6 md:p-8 minimal-shadow">

                  {/* AWB Card */}
                  <div className="mb-8 sm:mb-10 p-4 sm:p-5 md:p-6 bg-surface-container-low rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-border-subtle/50">
                    <div>
                      <p className="text-[11px] sm:text-xs font-semibold text-on-surface-variant mb-0.5">
                        Airway Bill Number (AWB)
                      </p>

                      <p className="text-base sm:text-lg md:text-xl font-bold text-primary-container tracking-wide font-mono">
                        {order.shipping.tracking_number || "-"}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!order.shipping.tracking_number}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-primary text-white rounded-lg text-xs md:text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition shadow-sm shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCopyAWB}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        content_copy
                      </span>

                      Copy AWB
                    </button>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-8 sm:space-y-10 md:space-y-12 pl-1 sm:pl-2">
                    {order.timeline.map((item, index) => (
                      <div
                        key={`${item.status}-${item.created_at}-${index}`}
                        className={`relative flex gap-4 sm:gap-6 tracking-timeline-item ${
                          isTimelineActive(order.timeline, index)
                            ? "active"
                            : ""
                        }`}
                      >
                        <div
                          className={`z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                            index === 0
                              ? "bg-primary-container text-white shadow-md"
                              : "bg-surface-container-high text-on-surface-variant border border-border-subtle bg-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg sm:text-xl">
                            {getTimelineIcon(item.status)}
                          </span>
                        </div>

                        <div className="flex-grow pb-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h3
                              className={`text-sm sm:text-base md:text-lg font-bold ${
                                index === 0
                                  ? "text-primary"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {item.title}
                            </h3>

                            <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant">
                              {formatDate(item.created_at)}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation */}
                  {actions.can_request_cancel && (
                    <div className="mt-8 pt-6 border-t border-border-subtle">
                      <button
                        type="button"
                        onClick={() => {
                          setCancellationOpen(true);
                          setCancellationError("");
                          setCancellationSuccess("");
                        }}
                        className="w-full border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          cancel
                        </span>

                        Ajukan Pembatalan Pesanan
                      </button>
                    </div>
                  )}

                  {/* Cancellation Status */}
                  {order.cancellation_request && (
                    <div className="mt-8 pt-6 border-t border-border-subtle">
                      <div className="p-4 rounded-lg bg-surface-container-low border border-border-subtle">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            pending_actions
                          </span>

                          <h3 className="text-sm font-bold text-primary">
                            Status Pembatalan
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-on-surface-variant">
                          Status:{" "}
                          <span className="font-bold text-primary">
                            {order.cancellation_request.status}
                          </span>
                        </p>

                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                          Alasan:{" "}
                          <span className="font-medium">
                            {order.cancellation_request.reason}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Refund */}
                  {order.refund && (
                    <div className="mt-8 pt-6 border-t border-border-subtle">
                      <div className="p-4 rounded-lg bg-surface-container-low border border-border-subtle">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            currency_exchange
                          </span>

                          <h3 className="text-sm font-bold text-primary">
                            Informasi Refund
                          </h3>
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant">
                              Nomor Refund
                            </span>

                            <span className="font-bold text-primary">
                              {order.refund.refund_number}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant">
                              Jumlah
                            </span>

                            <span className="font-bold text-primary">
                              {formatRupiah(order.refund.amount)}
                            </span>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-on-surface-variant">
                              Status
                            </span>

                            <span className="font-bold text-primary">
                              {order.refund.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Summary & Support */}
                <aside className="lg:col-span-4 space-y-6 w-full">

                  {/* Order Summary */}
                  <div className="bg-white border border-border-subtle rounded-xl overflow-hidden minimal-shadow">
                    <div className="p-5 sm:p-6">
                      <h2 className="text-base md:text-lg font-bold text-primary mb-4 sm:mb-6">
                        Order Summary
                      </h2>

                      <div className="space-y-5 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-border-subtle">
                        {order.items.map((item, index) => (
                          <div
                            key={`${item.product_id}-${index}`}
                            className="flex gap-4 items-center"
                          >
                            {normalizeImageUrl(item.image) ? (
                              <img
                                src={normalizeImageUrl(item.image)!}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg bg-surface-container-low border border-border-subtle shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg bg-surface-container-low border border-border-subtle shrink-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-surface-variant">
                                  image
                                </span>
                              </div>
                            )}

                            <div className="flex flex-col justify-center min-w-0">
                              <h4 className="text-xs sm:text-sm md:text-base font-bold text-primary mb-0.5">
                                {item.name}
                              </h4>

                              <p className="text-[11px] sm:text-xs font-medium text-on-surface-variant">
                                {formatRupiah(item.unit_price)}
                              </p>

                              <p className="text-xs font-bold text-on-surface-variant mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 text-xs md:text-sm font-medium">
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">
                            Subtotal
                          </span>

                          <span className="font-bold text-primary">
                            {formatRupiah(order.summary.subtotal)}
                          </span>
                        </div>

                        {Number(order.summary.voucher_discount) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant">
                              Voucher
                            </span>

                            <span className="font-bold text-green-600">
                              - {formatRupiah(order.summary.voucher_discount)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">
                            Shipping
                          </span>

                          <span className="font-bold text-primary">
                            {Number(order.summary.shipping_fee) === 0
                              ? "Free"
                              : formatRupiah(order.summary.shipping_fee)}
                          </span>
                        </div>

                        <div className="flex justify-between pt-3 border-t border-border-subtle items-center">
                          <span className="font-bold text-primary text-xs sm:text-sm md:text-base">
                            Total Paid
                          </span>

                          <span className="text-base sm:text-lg md:text-xl font-bold text-secondary">
                            {formatRupiah(order.summary.total_payment)}
                          </span>
                        </div>
                      </div>

                      {/* Download Invoice */}
                      {actions.can_download_invoice && (
                        <div className="mt-6 pt-4 border-t border-border-subtle">
                          <button
                            type="button"
                            onClick={handleDownloadInvoice}
                            disabled={downloading}
                            className="w-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors h-10 sm:h-11 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                          >
                            {downloading ? (
                              <>
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                                Downloading Invoice...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[18px]">
                                  download
                                </span>
                                Download Invoice
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="bg-primary-container text-white rounded-xl p-5 sm:p-6 md:p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <h2 className="text-base md:text-lg font-bold mb-1.5">
                      Need Help?
                    </h2>

                    <p className="text-xs md:text-sm text-white/70 mb-4 sm:mb-6 font-medium leading-relaxed">
                      If you have any questions regarding your delivery, our team is here for you.
                    </p>

                    <div className="space-y-2.5 sm:space-y-3 relative z-10">
                      <a
                        className="flex items-center gap-3 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 active:bg-white/25 transition rounded-lg group text-xs md:text-sm font-bold"
                        href="https://wa.me/6281133302007"
                      >
                        <span className="material-symbols-outlined text-white text-lg sm:text-xl">
                          support_agent
                        </span>

                        <span>Customer Support</span>

                        <span className="material-symbols-outlined ml-auto text-[18px] opacity-0 group-hover:opacity-100 transition">
                          arrow_forward
                        </span>
                      </a>

                      <a
                        className="flex items-center gap-3 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 active:bg-white/25 transition rounded-lg group text-xs md:text-sm font-bold"
                        href="/shipping-policy"
                      >
                        <span className="material-symbols-outlined text-white text-lg sm:text-xl">
                          help
                        </span>

                        <span>FAQs & Shipping Policy</span>

                        <span className="material-symbols-outlined ml-auto text-[18px] opacity-0 group-hover:opacity-100 transition">
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      <ChatWidget />

      {/* Cancellation Modal */}
      {cancellationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (!cancelling) {
                setCancellationOpen(false);
                setCancellationError("");
                setCancellationSuccess("");
              }
            }}
          />

          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-primary">
                  Ajukan Pembatalan Pesanan
                </h2>

                <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  Masukkan alasan pembatalan pesanan Anda.
                </p>
              </div>

              <button
                type="button"
                disabled={cancelling}
                onClick={() => {
                  setCancellationOpen(false);
                  setCancellationError("");
                  setCancellationSuccess("");
                }}
                className="text-on-surface-variant hover:text-primary disabled:opacity-50"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            <textarea
              value={cancellationReason}
              onChange={(event) => {
                setCancellationReason(event.target.value);
                setCancellationError("");
              }}
              disabled={cancelling}
              rows={5}
              maxLength={500}
              placeholder="Contoh: Saya ingin membatalkan pesanan karena..."
              className="w-full border border-border-subtle rounded-lg p-3 text-sm text-primary outline-none focus:border-primary resize-none disabled:bg-slate-50"
            />

            <div className="flex justify-between mt-1 text-[11px] text-on-surface-variant">
              <span>Minimal 5 karakter</span>
              <span>{cancellationReason.length}/500</span>
            </div>

            {cancellationError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600">
                {cancellationError}
              </div>
            )}

            {cancellationSuccess && (
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs sm:text-sm text-green-700">
                {cancellationSuccess}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => {
                  setCancellationOpen(false);
                  setCancellationError("");
                  setCancellationSuccess("");
                }}
                className="flex-1 h-10 sm:h-11 border border-border-subtle text-on-surface-variant rounded-lg text-xs sm:text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={cancelling || cancellationReason.trim().length < 5}
                onClick={handleSubmitCancellation}
                className="flex-1 h-10 sm:h-11 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Mengirim..." : "Ajukan Pembatalan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </LegacyPage>
  );
}