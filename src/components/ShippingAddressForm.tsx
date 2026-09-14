// components/ShippingAddressForm.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { WILAYAH } from "@/lib/wilayah";
import { useCheckout } from "@/components/CheckoutForm";

const inputClass =
  "w-full h-11 px-4 bg-bg-alt border border-border-subtle rounded-lg text-sm font-medium text-textDark form-input-focus focus:border-primary transition-all placeholder:text-textMuted/50";

function ErrorText({ msg }: { msg?: string | undefined }) {
  if (!msg) return null;
  return <p className="text-[11px] md:text-xs font-semibold text-secondary">{msg}</p>;
}

function Combobox({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  emptyText,
  error,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  emptyText: string;
  error?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div className="space-y-1.5" ref={boxRef}>
      <label className="block text-xs md:text-sm font-semibold text-textMuted">{label}</label>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          disabled={disabled}
          className={`${inputClass} pr-10 disabled:opacity-60 disabled:cursor-not-allowed ${error ? "border-secondary" : ""}`}
          placeholder={placeholder}
          value={open ? query : value}
          onFocus={() => {
            if (disabled) return;
            setQuery("");
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-textMuted text-[20px] pointer-events-none">
          {open ? "expand_less" : "expand_more"}
        </span>
        {open && !disabled ? (
          <ul
            role="listbox"
            className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-border-subtle rounded-lg shadow-lg py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-textMuted">{emptyText}</li>
            ) : (
              filtered.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt === value}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition hover:bg-primary/5 hover:text-primary ${
                      opt === value ? "text-primary font-bold bg-primary/5" : "text-textDark"
                    }`}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      <ErrorText msg={error} />
    </div>
  );
}

export function ShippingAddressForm() {
  const { fields, setField, errors } = useCheckout();

  // Ambil daftar kota berdasarkan provinsi terpilih
  const currentProvince = useMemo(
    () => WILAYAH.find((p) => p.name === fields.provinsi),
    [fields.provinsi]
  );
  
  const cities = useMemo(
    () => currentProvince?.cities ?? [],
    [currentProvince]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Nama Lengkap */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">Nama Lengkap</label>
        <input
          className={`${inputClass} ${errors.nama ? "border-secondary" : ""}`}
          placeholder="e.g. Erik Sorenson"
          type="text"
          maxLength={100}
          value={fields.nama}
          onChange={(e) => setField("nama", e.target.value)}
        />
        <ErrorText msg={errors.nama} />
      </div>

      {/* 2. No. WhatsApp / HP */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">No. WhatsApp / HP</label>
        <input
          className={`${inputClass} ${errors.phone ? "border-secondary" : ""}`}
          placeholder="e.g. 081234567890"
          type="tel"
          maxLength={20}
          value={fields.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
        <ErrorText msg={errors.phone} />
      </div>

      {/* 3. Alamat Lengkap */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">Alamat Lengkap</label>
        <textarea
          className={`w-full p-4 bg-bg-alt border rounded-lg text-sm font-medium text-textDark form-input-focus focus:border-primary transition-all resize-none placeholder:text-textMuted/50 ${
            errors.alamat ? "border-secondary" : "border-border-subtle"
          }`}
          placeholder="Nama jalan, nomor rumah, RT/RW, lantai/blok"
          rows={3}
          maxLength={500}
          value={fields.alamat}
          onChange={(e) => setField("alamat", e.target.value)}
        />
        <ErrorText msg={errors.alamat} />
      </div>

      {/* 4. Provinsi (Combobox) */}
      <div className="md:col-span-1">
        <Combobox
          label="Provinsi"
          placeholder="Cari atau pilih provinsi"
          options={WILAYAH.map((p) => p.name)}
          value={fields.provinsi}
          error={errors.provinsi}
          emptyText="Provinsi tidak ditemukan"
          onChange={(v) => {
            setField("provinsi", v);
            setField("kota", "");
          }}
        />
      </div>

      {/* 5. Kota / Kabupaten (Combobox Berantai dari Provinsi) */}
      <div className="md:col-span-1">
        <Combobox
          label="Kota / Kabupaten"
          placeholder={fields.provinsi ? "Cari atau pilih kota/kabupaten" : "Pilih provinsi terlebih dahulu"}
          options={cities}
          value={fields.kota}
          error={errors.kota}
          disabled={!fields.provinsi}
          emptyText="Kota/Kabupaten tidak ditemukan"
          onChange={(v) => setField("kota", v)}
        />
      </div>

      {/* 6. Kecamatan (Input Text Bebas) */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">Kecamatan</label>
        <input
          className={`${inputClass} ${errors.kecamatan ? "border-secondary" : ""}`}
          placeholder="e.g. Lowokwaru"
          type="text"
          maxLength={100}
          value={fields.kecamatan}
          onChange={(e) => setField("kecamatan", e.target.value)}
        />
        <ErrorText msg={errors.kecamatan} />
      </div>

      {/* 7. Kode Pos */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">Kode Pos</label>
        <input
          className={`${inputClass} ${errors.kodePos ? "border-secondary" : ""}`}
          placeholder="e.g. 65141"
          type="text"
          maxLength={10}
          value={fields.kodePos}
          onChange={(e) => setField("kodePos", e.target.value.replace(/\D/g, ""))}
        />
        <ErrorText msg={errors.kodePos} />
      </div>

      {/* 8. Email (Opsional) */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          E-mail <span className="font-medium text-textMuted/70">(opsional untuk bukti resi)</span>
        </label>
        <input
          className={`${inputClass} ${errors.email ? "border-secondary" : ""}`}
          placeholder="nama@email.com"
          type="email"
          maxLength={255}
          value={fields.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <ErrorText msg={errors.email} />
      </div>
    </div>
  );
}