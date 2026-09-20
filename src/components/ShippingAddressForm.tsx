// components/ShippingAddressForm.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useCheckout } from "@/components/CheckoutForm";

const inputClass =
  "w-full h-11 px-4 bg-bg-alt border border-border-subtle rounded-lg text-sm font-medium text-textDark form-input-focus focus:border-primary transition-all placeholder:text-textMuted/50";

type Province = {
  id: string;
  name: string;
};

type Regency = {
  id: string;
  province_id: string;
  name: string;
};

function ErrorText({ msg }: { msg?: string | undefined }) {
  if (!msg) return null;

  return (
    <p className="text-[11px] md:text-xs font-semibold text-secondary">
      {msg}
    </p>
  );
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
      if (
        boxRef.current &&
        !boxRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return options;
    }

    return options.filter((o) =>
      o.toLowerCase().includes(q)
    );
  }, [options, query]);

  return (
    <div className="space-y-1.5" ref={boxRef}>
      <label className="block text-xs md:text-sm font-semibold text-textMuted">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          disabled={disabled}
          className={`${inputClass} pr-10 disabled:opacity-60 disabled:cursor-not-allowed ${
            error ? "border-secondary" : ""
          }`}
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
              <li className="px-4 py-2.5 text-sm text-textMuted">
                {emptyText}
              </li>
            ) : (
              filtered.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt === value}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition hover:bg-primary/5 hover:text-primary ${
                      opt === value
                        ? "text-primary font-bold bg-primary/5"
                        : "text-textDark"
                    }`}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      setQuery("");
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

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  const [provinceLoadError, setProvinceLoadError] = useState("");
  const [regencyLoadError, setRegencyLoadError] = useState("");

  /*
   * ============================================================
   * Ambil daftar provinsi
   * GET /api/locations/provinces
   * ============================================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProvinces() {
      try {
        setLoadingProvinces(true);
        setProvinceLoadError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/provinces`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar provinsi.");
        }

        const result = await response.json();

        if (cancelled) return;

        setProvinces(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Gagal mengambil daftar provinsi:",
          error
        );

        setProvinces([]);
        setProvinceLoadError(
          "Gagal memuat daftar provinsi."
        );
      } finally {
        if (!cancelled) {
          setLoadingProvinces(false);
        }
      }
    }

    loadProvinces();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * Ambil daftar kabupaten/kota berdasarkan provinsi
   *
   * GET /api/locations/provinces/{provinceId}/regencies
   * ============================================================
   */
  useEffect(() => {
    let cancelled = false;

    /*
     * Belum memilih provinsi
     * → kosongkan daftar kabupaten/kota
     */
    if (!fields.province_id) {
      setRegencies([]);
      setRegencyLoadError("");
      setLoadingRegencies(false);

      return;
    }

    async function loadRegencies() {
      try {
        setLoadingRegencies(true);
        setRegencyLoadError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/provinces/${fields.province_id}/regencies`
        );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil daftar kabupaten/kota."
          );
        }

        const result = await response.json();

        if (cancelled) return;

        setRegencies(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Gagal mengambil daftar kabupaten/kota:",
          error
        );

        setRegencies([]);
        setRegencyLoadError(
          "Gagal memuat daftar kota/kabupaten."
        );
      } finally {
        if (!cancelled) {
          setLoadingRegencies(false);
        }
      }
    }

    loadRegencies();

    return () => {
      cancelled = true;
    };
  }, [fields.province_id]);

  const provinceOptions = useMemo(
    () => provinces.map((province) => province.name),
    [provinces]
  );

  const regencyOptions = useMemo(
    () => regencies.map((regency) => regency.name),
    [regencies]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ======================================================
          1. Nama Lengkap
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          Nama Lengkap
        </label>

        <input
          className={`${inputClass} ${
            errors.nama ? "border-secondary" : ""
          }`}
          placeholder="e.g. Erik Sorenson"
          type="text"
          maxLength={100}
          value={fields.nama}
          onChange={(e) =>
            setField("nama", e.target.value)
          }
        />

        <ErrorText msg={errors.nama} />
      </div>


      {/* ======================================================
          2. No. WhatsApp / HP
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          No. WhatsApp / HP
        </label>

        <input
          className={`${inputClass} ${
            errors.phone ? "border-secondary" : ""
          }`}
          placeholder="e.g. 081234567890"
          type="tel"
          maxLength={20}
          value={fields.phone}
          onChange={(e) =>
            setField("phone", e.target.value)
          }
        />

        <ErrorText msg={errors.phone} />
      </div>


      {/* ======================================================
          3. Alamat Lengkap
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          Alamat Lengkap
        </label>

        <textarea
          className={`w-full p-4 bg-bg-alt border rounded-lg text-sm font-medium text-textDark form-input-focus focus:border-primary transition-all resize-none placeholder:text-textMuted/50 ${
            errors.alamat
              ? "border-secondary"
              : "border-border-subtle"
          }`}
          placeholder="Nama jalan, nomor rumah, RT/RW, lantai/blok"
          rows={3}
          maxLength={500}
          value={fields.alamat}
          onChange={(e) =>
            setField("alamat", e.target.value)
          }
        />

        <ErrorText msg={errors.alamat} />
      </div>


      {/* ======================================================
          4. Provinsi
          GET /api/locations/provinces
          ====================================================== */}
      <div className="md:col-span-1">
        <Combobox
          label="Provinsi"
          placeholder={
            loadingProvinces
              ? "Memuat provinsi..."
              : "Cari atau pilih provinsi"
          }
          options={provinceOptions}
          value={fields.provinsi}
          error={
            errors.provinsi || provinceLoadError
          }
          emptyText={
            loadingProvinces
              ? "Memuat provinsi..."
              : provinceLoadError
                ? "Gagal memuat provinsi"
                : "Provinsi tidak ditemukan"
          }
          disabled={loadingProvinces}
          onChange={(name) => {
            const province = provinces.find(
              (item) => item.name === name
            );

            if (!province) return;

            /*
             * Simpan nama provinsi untuk tampilan.
             */
            setField(
              "provinsi",
              province.name
            );

            /*
             * Simpan ID provinsi untuk mengambil
             * daftar kabupaten/kota.
             */
            setField(
              "province_id",
              province.id
            );

            /*
             * Ketika provinsi berubah,
             * pilihan kabupaten/kota sebelumnya
             * harus dibuang.
             */
            setField("kota", "");
            setField("regency_id", "");
          }}
        />
      </div>


      {/* ======================================================
          5. Kota / Kabupaten
          GET /api/locations/provinces/{provinceId}/regencies
          ====================================================== */}
      <div className="md:col-span-1">
        <Combobox
          label="Kota / Kabupaten"
          placeholder={
            !fields.province_id
              ? "Pilih provinsi terlebih dahulu"
              : loadingRegencies
                ? "Memuat kota/kabupaten..."
                : "Cari atau pilih kota/kabupaten"
          }
          options={regencyOptions}
          value={fields.kota}
          error={
            errors.kota || regencyLoadError
          }
          disabled={
            !fields.province_id ||
            loadingRegencies
          }
          emptyText={
            loadingRegencies
              ? "Memuat kota/kabupaten..."
              : regencyLoadError
                ? "Gagal memuat kota/kabupaten"
                : "Kota/Kabupaten tidak ditemukan"
          }
          onChange={(name) => {
            const regency = regencies.find(
              (item) => item.name === name
            );

            if (!regency) return;

            /*
             * Simpan nama kabupaten/kota untuk tampilan.
             */
            setField(
              "kota",
              regency.name
            );

            /*
             * Simpan ID kabupaten/kota.
             *
             * ID inilah yang nantinya digunakan
             * untuk:
             * - estimate shipping
             * - checkout
             */
            setField(
              "regency_id",
              regency.id
            );
          }}
        />
      </div>


      {/* ======================================================
          6. Kecamatan
          Tetap input manual.
          Backend menggunakan field ini sebagai "area".
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          Kecamatan
        </label>

        <input
          className={`${inputClass} ${
            errors.kecamatan
              ? "border-secondary"
              : ""
          }`}
          placeholder="e.g. Lowokwaru"
          type="text"
          maxLength={100}
          value={fields.kecamatan}
          onChange={(e) =>
            setField(
              "kecamatan",
              e.target.value
            )
          }
        />

        <ErrorText msg={errors.kecamatan} />
      </div>


      {/* ======================================================
          7. Kode Pos
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-1">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          Kode Pos
        </label>

        <input
          className={`${inputClass} ${
            errors.kodePos
              ? "border-secondary"
              : ""
          }`}
          placeholder="e.g. 65141"
          type="text"
          maxLength={10}
          value={fields.kodePos}
          onChange={(e) =>
            setField(
              "kodePos",
              e.target.value.replace(/\D/g, "")
            )
          }
        />

        <ErrorText msg={errors.kodePos} />
      </div>


      {/* ======================================================
          8. Email
          ====================================================== */}
      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-xs md:text-sm font-semibold text-textMuted">
          E-mail{" "}
          <span className="font-medium text-textMuted/70">
            (opsional untuk bukti resi)
          </span>
        </label>

        <input
          className={`${inputClass} ${
            errors.email
              ? "border-secondary"
              : ""
          }`}
          placeholder="nama@email.com"
          type="email"
          maxLength={255}
          value={fields.email}
          onChange={(e) =>
            setField(
              "email",
              e.target.value
            )
          }
        />

        <ErrorText msg={errors.email} />
      </div>

    </div>
  );
}