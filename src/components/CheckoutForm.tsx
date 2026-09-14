// components/CheckoutForm.tsx
'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type CheckoutFields = {
  nama: string;
  phone: string;
  email: string;
  alamat: string;
  kecamatan: string;
  provinsi: string;
  kota: string;
  kodePos: string;
};

type Ctx = {
  fields: CheckoutFields;
  setField: (k: keyof CheckoutFields, v: string) => void;
  errors: Partial<Record<keyof CheckoutFields | "shipping", string>>;
  setError: (k: keyof CheckoutFields | "shipping", v: string) => void;
  shipping: string;
  setShipping: (v: string) => void;
  validateAll: () => boolean;
};

const CheckoutCtx = createContext<Ctx | null>(null);

export function useCheckout() {
  const ctx = useContext(CheckoutCtx);
  const fallback = useCheckoutStore();
  return ctx ?? fallback;
}

const REQUIRED_LABELS: Record<string, string> = {
  nama: "Nama lengkap wajib diisi.",
  phone: "Nomor telepon wajib diisi.",
  alamat: "Alamat lengkap wajib diisi.",
  provinsi: "Provinsi wajib dipilih.",
  kota: "Kota / Kabupaten wajib dipilih.",
  kecamatan: "Kecamatan wajib dipilih.",
  kodePos: "Kode pos wajib diisi.",
};

function useCheckoutStore(): Ctx {
  const [fields, setFields] = useState<CheckoutFields>({
    nama: "",
    phone: "",
    email: "",
    alamat: "",
    kecamatan: "",
    provinsi: "",
    kota: "",
    kodePos: "",
  });
  const [errors, setErrors] = useState<Ctx["errors"]>({});
  const [shipping, setShippingState] = useState("");

  const value = useMemo<Ctx>(
    () => ({
      fields,
      setField: (k, v) => {
        setFields((f) => ({ ...f, [k]: v }));
        setErrors((e) => ({ ...e, [k]: "" }));
      },
      errors,
      setError: (k, v) => setErrors((e) => ({ ...e, [k]: v })),
      shipping,
      setShipping: (v) => {
        setShippingState(v);
        setErrors((e) => ({ ...e, shipping: "" }));
      },
      validateAll: () => {
        const next: Ctx["errors"] = {};
        (Object.keys(REQUIRED_LABELS) as (keyof CheckoutFields)[]).forEach((k) => {
          if (!fields[k].trim()) next[k] = REQUIRED_LABELS[k] ?? "Wajib diisi.";
        });

        if (fields.phone.trim() && fields.phone.replace(/\D/g, "").length < 9) {
          next.phone = "Nomor telepon tidak valid.";
        }
        if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
          next.email = "Format e-mail tidak valid.";
        }
        if (!shipping) next.shipping = "Pilih metode pengiriman terlebih dahulu.";
        setErrors(next);
        return Object.keys(next).length === 0;
      },
    }),
    [fields, errors, shipping],
  );

  return value;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const value = useCheckoutStore();
  return <CheckoutCtx.Provider value={value}>{children}</CheckoutCtx.Provider>;
}

// ... Sisanya (ShippingMethodOptions, VoucherBox, PlaceOrderButton) tetap sama

const SHIPPING_OPTIONS = [
  { id: "jnt-cargo", name: "JNT Cargo", desc: "Estimasi tiba dalam 3-5 hari kerja", price: "Rp 150.000" },
  { id: "sentral-cargo", name: "Sentral Cargo", desc: "Estimasi tiba dalam 4-7 hari kerja", price: "Rp 135.000" },
];

export function ShippingMethodOptions() {
  const { shipping, setShipping, errors } = useCheckout();
  return (
    <div className="space-y-3">
      {SHIPPING_OPTIONS.map((opt) => {
        const active = shipping === opt.id;
        return (
          <label
            key={opt.id}
            className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all ${
              active ? "border-2 border-primary bg-primary/5" : "border border-border-subtle hover:border-primary"
            }`}
          >
            <input
              className="w-5 h-5 text-primary border-border-subtle focus:ring-primary cursor-pointer"
              name="shipping"
              type="radio"
              value={opt.id}
              checked={active}
              onChange={() => setShipping(opt.id)}
            />
            <div className="ml-4 flex flex-1 justify-between items-center gap-2">
              <div>
                <p className={`text-sm md:text-base font-bold ${active ? "text-primary" : "text-textDark"}`}>{opt.name}</p>
                <p className="text-xs md:text-sm text-textMuted font-medium">{opt.desc}</p>
              </div>
              <span className={`text-sm md:text-base font-bold ${active ? "text-primary" : "text-textDark"}`}>{opt.price}</span>
            </div>
          </label>
        );
      })}
      {errors.shipping ? (
        <p className="text-[11px] md:text-xs font-semibold text-secondary">{errors.shipping}</p>
      ) : null}
    </div>
  );
}

export function VoucherBox() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function apply() {
    const v = code.trim();
    if (!v) {
      setMsg({ ok: false, text: "Masukkan kode voucher terlebih dahulu." });
      return;
    }
    if (v.toUpperCase() === "MELODY10") {
      setMsg({ ok: true, text: "Voucher berhasil diterapkan (diskon 10%)." });
      return;
    }
    setMsg({ ok: false, text: "Kode voucher tidak valid." });
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs md:text-sm font-semibold text-textMuted">Kode Voucher</label>
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={30}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setMsg(null);
          }}
          placeholder="Masukkan kode voucher"
          className="flex-1 min-w-0 h-11 px-4 bg-bg-alt border border-border-subtle rounded-lg text-sm font-medium text-textDark form-input-focus focus:border-primary transition-all placeholder:text-textMuted/50"
        />
        <button
          type="button"
          onClick={apply}
          className="h-11 px-4 shrink-0 rounded-lg bg-primary text-white text-xs md:text-sm font-bold hover:bg-opacity-90 transition"
        >
          Terapkan
        </button>
      </div>
      {msg ? (
        <p className={`text-[11px] md:text-xs font-semibold ${msg.ok ? "text-[#1B7F4C]" : "text-secondary"}`}>{msg.text}</p>
      ) : null}
    </div>
  );
}

export function PlaceOrderButton() {
  const { validateAll } = useCheckout();
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={() => {
          if (!validateAll()) {
            setFailed(true);
            document.querySelector("#alamat-pengiriman")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
          setFailed(false);
          router.push("/payment");
        }}
        className="w-full h-12 md:h-14 bg-secondary text-white hover:bg-opacity-95 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.99] shadow-md font-bold text-sm md:text-base tracking-wide uppercase"
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
          lock
        </span>
        Buat Pesanan Sekarang
      </button>
      {failed ? (
        <p className="text-[11px] md:text-xs font-semibold text-secondary text-center">
          Lengkapi data wajib dan pilih metode pengiriman terlebih dahulu.
        </p>
      ) : null}
    </div>
  );
}
