'use client';

import { useState } from "react";
import { LegacyPage } from "@/components/LegacyPage";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/track.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TrackPage() {
  const [downloading, setDownloading] = useState(false);

  // Handler Dummy untuk Download Invoice
  const handleDownloadInvoice = () => {
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
      // Membuat file dummy teks/PDF sederhana untuk diunduh
      const element = document.createElement("a");
      const file = new Blob([
        `INVOICE - #ORD-2024-8892\nTanggal: 24 Okt 2024\n\nProduk: Nordic Oak Chair (Qty: 1) - Rp 1.250.000\nPengiriman: Free\nTotal Pembayaran: Rp 1.250.000\nStatus: Paid`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "Invoice-ORD-2024-8892.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <LegacyPage
      theme="admin"
      css={css}
      js={js}
      bodyClassName="text-on-background antialiased min-h-screen flex flex-col bg-slate-50/50"
      bodyStyle={{}}
      dataAttrs={{}}
    >
      {/* Fallback DOM untuk mematikan error `updateCountdown` pada script legacy */}
      <div className="hidden" aria-hidden="true">
        <span id="countdown">00:00</span>
        <span id="timer">00:00</span>
        <span id="minutes">00</span>
        <span id="seconds">00</span>
        <span id="hours">00</span>
        <span id="days">00</span>
        <div id="countdown-card"></div>
      </div>

      <Navbar />

      <main className="flex-grow py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="w-full">
          
          {/* Header Card */}
          <div className="bg-white border border-border-subtle rounded-xl p-5 sm:p-6 md:p-8 mb-6 minimal-shadow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight mb-1 sm:mb-2">
                  Track Your Order
                </h1>
                <p className="text-xs sm:text-sm font-medium text-on-surface-variant flex items-center gap-2">
                  Order ID: <span className="text-primary font-bold">#ORD-2024-8892</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border-subtle">
                <span className="bg-secondary-container text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide">
                  On the way
                </span>
                <p className="text-xs sm:text-sm font-medium text-on-surface-variant">
                  Estimated Delivery: <span className="font-bold text-primary">Oct 24, 2024</span>
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
                    SCP-8839-2011
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-primary text-white rounded-lg text-xs md:text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition shadow-sm shrink-0 cursor-pointer"
                  onClick={(event) => runInline(event, `copyAWB(event)`)}
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  Copy AWB
                </button>
              </div>

              {/* Status Timeline */}
              <div className="space-y-8 sm:space-y-10 md:space-y-12 pl-1 sm:pl-2">
                <div className="relative flex gap-4 sm:gap-6 tracking-timeline-item active">
                  <div className="z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-md shrink-0">
                    <span className="material-symbols-outlined text-lg sm:text-xl">local_shipping</span>
                  </div>
                  <div className="flex-grow pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary">Shipped</h3>
                      <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant">Oct 21, 14:30</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                      Package is in transit. Currently at Distribution Center, Tangerang.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 sm:gap-6 tracking-timeline-item">
                  <div className="z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-border-subtle bg-white shrink-0">
                    <span className="material-symbols-outlined text-lg sm:text-xl">package_2</span>
                  </div>
                  <div className="flex-grow pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-on-surface-variant">Packed & Ready</h3>
                      <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant">Oct 20, 09:15</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                      Order has been packed and is waiting for courier pickup.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 sm:gap-6 tracking-timeline-item">
                  <div className="z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-border-subtle bg-white shrink-0">
                    <span className="material-symbols-outlined text-lg sm:text-xl">inventory</span>
                  </div>
                  <div className="flex-grow pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-on-surface-variant">Order Processed</h3>
                      <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant">Oct 19, 11:45</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                      We have received your order and are preparing the items.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 sm:gap-6 tracking-timeline-item">
                  <div className="z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center border border-border-subtle bg-white shrink-0">
                    <span className="material-symbols-outlined text-lg sm:text-xl">check_circle</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-on-surface-variant">Payment Confirmed</h3>
                      <span className="text-[11px] sm:text-xs font-medium text-on-surface-variant">Oct 19, 11:30</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 leading-relaxed">
                      Payment successfully verified via Credit Card.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Summary & Support */}
            <aside className="lg:col-span-4 space-y-6 w-full">
              {/* Order Summary */}
              <div className="bg-white border border-border-subtle rounded-xl overflow-hidden minimal-shadow">
                <div className="p-5 sm:p-6">
                  <h2 className="text-base md:text-lg font-bold text-primary mb-4 sm:mb-6">Order Summary</h2>
                  
                  <div className="flex gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border-subtle items-center">
                    <img
                      alt="Nordic Oak Chair"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg bg-surface-container-low border border-border-subtle shrink-0"
                      src="https://i.pinimg.com/736x/a0/98/43/a0984398ba783a3e8d658508420d71ed.jpg"
                    />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-xs sm:text-sm md:text-base font-bold text-primary mb-0.5">
                        Nordic Oak Chair
                      </h4>
                      <p className="text-[11px] sm:text-xs font-medium text-on-surface-variant">
                        Natural Ash / Wool Blend
                      </p>
                      <p className="text-xs font-bold text-on-surface-variant mt-1">Qty: 1</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs md:text-sm font-medium">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Subtotal</span>
                      <span className="font-bold text-primary">Rp 1.250.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Shipping</span>
                      <span className="font-bold text-primary">Free</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border-subtle items-center">
                      <span className="font-bold text-primary text-xs sm:text-sm md:text-base">Total Paid</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold text-secondary">Rp 1.250.000</span>
                    </div>
                  </div>

                  {/* Tombol Download Invoice */}
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
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Download Invoice
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="bg-primary-container text-white rounded-xl p-5 sm:p-6 md:p-8 relative overflow-hidden shadow-sm">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <h2 className="text-base md:text-lg font-bold mb-1.5">Need Help?</h2>
                <p className="text-xs md:text-sm text-white/70 mb-4 sm:mb-6 font-medium leading-relaxed">
                  If you have any questions regarding your delivery, our team is here for you.
                </p>

                <div className="space-y-2.5 sm:space-y-3 relative z-10">
                  <a
                    className="flex items-center gap-3 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 active:bg-white/25 transition rounded-lg group text-xs md:text-sm font-bold"
                    href="https://wa.me/6281133302007"
                  >
                    <span className="material-symbols-outlined text-white text-lg sm:text-xl">support_agent</span>
                    <span>Customer Support</span>
                    <span className="material-symbols-outlined ml-auto text-[18px] opacity-0 group-hover:opacity-100 transition">
                      arrow_forward
                    </span>
                  </a>
                  <a
                    className="flex items-center gap-3 p-3.5 sm:p-4 bg-white/10 hover:bg-white/20 active:bg-white/25 transition rounded-lg group text-xs md:text-sm font-bold"
                    href="/shipping-policy"
                  >
                    <span className="material-symbols-outlined text-white text-lg sm:text-xl">help</span>
                    <span>FAQs & Shipping Policy</span>
                    <span className="material-symbols-outlined ml-auto text-[18px] opacity-0 group-hover:opacity-100 transition">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </LegacyPage>
  );
}