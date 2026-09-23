'use client';

import { Suspense } from "react";
import { LegacyPage } from "@/components/LegacyPage";
import { ShippingAddressForm } from "@/components/ShippingAddressForm";
import {
  CheckoutProvider,
  ShippingMethodOptions,
  VoucherBox,
  PlaceOrderButton,
  useCheckout,
} from "@/components/CheckoutForm";
import { runInline } from "@/lib/legacy-runtime";
import { css, js } from "@/legacy/checkout.legacy";
import { ChatWidget } from "@/components/ChatWidget";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://187.53.138.70:8081/api";
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

function CheckoutSummary() {
    const {
        selectedShippingFee,
        voucherDiscount,
        cartItems,
        cartSubtotal,
        cartLoading,
        cartError,
    } = useCheckout();
    
    const total = Math.max(
        0,
        cartSubtotal + selectedShippingFee - voucherDiscount
    );

  return (
    <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
      <div className="bg-white industrial-border rounded-xl overflow-hidden flat-shadow">
        <div className="p-5 bg-surface-container-low border-b border-border-subtle">
          <h3 className="text-base md:text-lg font-bold text-primary">
            Ringkasan Pesanan
          </h3>
        </div>

        <div className="p-6 space-y-5">

          {cartLoading ? (
            <div className="py-6 text-center text-sm text-textMuted">
                Memuat isi keranjang...
            </div>
            ) : cartError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {cartError}
            </div>
            ) : cartItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-textMuted">
                Keranjang kosong.
            </div>
            ) : (
            <div className="space-y-4">
                {cartItems.map((item) => (
                <div
                    key={item.id}
                    className="flex gap-4 items-start"
                >
                    <div className="w-20 h-20 bg-bg-alt rounded-lg overflow-hidden flex-shrink-0 border border-border-subtle">
                    {item.product.thumbnail ? (
                        <img
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        src={`${BACKEND_BASE_URL}${item.product.thumbnail}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-textMuted">
                        No Image
                        </div>
                    )}
                    </div>

                    <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-textDark text-sm md:text-base leading-snug">
                        {item.product.name}
                    </h4>

                    <p className="text-xs md:text-sm text-[#737785] font-medium mt-1">
                        Qty: {item.quantity}
                    </p>

                    <p className="text-secondary font-bold text-sm md:text-base mt-1.5">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            )}

          <hr className="border-border-subtle" />

          <div className="space-y-2.5 text-xs md:text-sm font-medium text-textMuted">
            <div className="flex justify-between items-center">
                <span>Subtotal Produk</span>

                <span className="text-textDark font-semibold">
                    Rp {cartSubtotal.toLocaleString("id-ID")}
                </span>
            </div>

            <div className="flex justify-between items-center">
                <span>Ongkos Kirim (Kargo)</span>

                <span className="text-textDark font-semibold">
                {selectedShippingFee > 0
                    ? `Rp ${selectedShippingFee.toLocaleString("id-ID")}`
                    : "-"}
                </span>
            </div>

            {voucherDiscount > 0 && (
                <div className="flex justify-between items-center">
                <span>Diskon Voucher</span>

                <span className="text-green-600 font-semibold">
                    - Rp {voucherDiscount.toLocaleString("id-ID")}
                </span>
                </div>
            )}
           </div>

          <hr className="border-border-subtle" />

          <VoucherBox />

          <hr className="border-border-subtle" />

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-textDark text-sm md:text-base">
              Total Keseluruhan
            </span>

            <span className="font-extrabold text-secondary text-lg md:text-xl">
                Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <PlaceOrderButton />

          <p className="text-center text-[11px] md:text-[12px] font-medium text-textMuted leading-normal mt-4">
            Dengan mengeklik tombol di atas, Anda telah menyetujui seluruh{" "}
            <a
              className="underline text-primary hover:text-opacity-80"
              href="#"
            >
              Syarat & Ketentuan
            </a>{" "}
            serta{" "}
            <a
              className="underline text-primary hover:text-opacity-80"
              href="/privacy-policy"
            >
              Kebijakan Privasi
            </a>{" "}
            dari Melody Furniture.
          </p>
        </div>

        <div className="bg-bgLight p-4 flex justify-center gap-6 border-t border-borderColor text-textMuted/60">
          <span
            className="material-symbols-outlined text-[24px]"
            title="Terverifikasi Aman"
          >
            verified_user
          </span>

          <span
            className="material-symbols-outlined text-[24px]"
            title="Keamanan SSL"
          >
            security
          </span>

          <span
            className="material-symbols-outlined text-[24px]"
            title="Pembayaran Terenkripsi"
          >
            credit_card
          </span>

          <span
            className="material-symbols-outlined text-[24px]"
            title="Garansi Kualitas Resmi"
          >
            workspace_premium
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <LegacyPage
      theme="admin"
      css={css}
      js={js}
      bodyClassName="bg-[#f8f9ff] text-on-surface antialiased"
      bodyStyle={{  }}
      dataAttrs={{}}
    >
      <>

    <Navbar/>
    
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-12">
        <div id="sidebarOverlay" className="fixed inset-0 bg-black/50 z-50 hidden opacity-0 transition-opacity duration-300 md:hidden"></div>
        <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight mb-2">Secure Checkout</h1>
            <div className="flex items-center gap-2 text-textMuted text-xs md:text-sm font-medium">
                <span>Keranjang</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-bold">Pengiriman & Pembayaran</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>Konfirmasi</span>
            </div>
        </div>

        <Suspense fallback={null}>
          <CheckoutProvider>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                <div className="w-full lg:w-[65%] space-y-6">
                    
                    
                    <section id="alamat-pengiriman" className="bg-white industrial-border p-6 md:p-8 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-borderColor pb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined font-semibold">local_shipping</span>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-textDark">Alamat Pengiriman</h2>
                        </div>
                        
                        <ShippingAddressForm />

                    </section>

                    
                    <section className="bg-white industrial-border p-6 md:p-8 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-borderColor pb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined font-semibold">inventory_2</span>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-textDark">Metode Pengiriman</h2>
                        </div>
                        
                        <ShippingMethodOptions />
                    </section>

                </div>
                <CheckoutSummary />
            </div>
          </CheckoutProvider>
        </Suspense>
    </main>

    <Footer/>
    <ChatWidget />

      </>
    </LegacyPage>
  );
}

void runInline;
