// components/CheckoutForm.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { requestWithGuestSession } from "@/lib/guestSession";
import { getProductDetail } from "@/services/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export type CheckoutFields = {
  nama: string;
  phone: string;
  email: string;
  alamat: string;
  kecamatan: string;
  provinsi: string;
  province_id: string;
  kota: string;
  regency_id: string;
  kodePos: string;
};

type ShippingOption = {
  courier_id: string;
  courier_code: string;
  courier_name: string;
  service: string;
  weight: number | null;
  fee: number | null;
  available: boolean;
};

type CartProduct = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  stock: number;
  is_sale: boolean;
};

type CartItem = {
  id: string;
  quantity: number;
  unit_price: string;
  subtotal: number;
  product: CartProduct;
};

type DirectCheckoutItem = {
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    price: number;
    discount_price?: number;
    original_price?: number;
  };
  subtotal: number;
};

type Ctx = {
  fields: CheckoutFields;
  setField: (k: keyof CheckoutFields, v: string) => void;
  setVoucherCode: (value: string) => void;

  errors: Partial<Record<keyof CheckoutFields | "shipping", string>>;
  setError: (
    k: keyof CheckoutFields | "shipping",
    v: string
  ) => void;

  shipping: string;
  setShipping: (v: string) => void;

  shippingOptions: ShippingOption[];
  shippingLoading: boolean;
  shippingError: string;
  selectedShippingFee: number;

  voucherCode: string;
  voucherDiscount: number;
  voucherValid: boolean;
  voucherMessage: string;
  voucherLoading: boolean;
  applyVoucher: () => Promise<void>;
  clearVoucher: () => void;

  cartItems: CartItem[];
  cartSubtotal: number;
  cartLoading: boolean;
  cartError: string;
  selectedItemIds: string[];

  checkoutMode: "cart" | "direct";
  directItem: DirectCheckoutItem | null;

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
    const searchParams = useSearchParams();

    const checkoutMode =
      searchParams.get("mode") === "direct"
        ? "direct"
        : "cart";

    const directProductId =
      searchParams.get("product_id");

    const directSlug =
      searchParams.get("slug");

    const directQuantity = Math.max(
      1,
      Number(searchParams.get("quantity") || 1)
    );
  const [fields, setFields] = useState<CheckoutFields>({
    nama: "",
    phone: "",
    email: "",
    alamat: "",
    kecamatan: "",
    provinsi: "",
    province_id: "",
    kota: "",
    regency_id: "",
    kodePos: "",
  });

  const [errors, setErrors] = useState<Ctx["errors"]>({});

  const [shipping, setShippingState] = useState("");

  const [shippingOptions, setShippingOptions] = useState<
    ShippingOption[]
  >([]);

  const [shippingLoading, setShippingLoading] =
    useState(false);

  const [shippingError, setShippingError] =
    useState("");

  const selectedShippingFee = useMemo(() => {
    const selectedOption = shippingOptions.find(
      (option) =>
        option.courier_code === shipping &&
        option.available &&
        option.fee !== null
    );

    return selectedOption?.fee ?? 0;
  }, [shippingOptions, shipping]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [directItem, setDirectItem] = useState<DirectCheckoutItem | null>(null);

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherValid, setVoucherValid] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      if (checkoutMode === "direct") {
        setCartItems([]);
        setCartSubtotal(0);
        setSelectedItemIds([]);
        setCartLoading(false);
        setCartError("");
        return;
      }
  
      try {
        setCartLoading(true);
        setCartError("");

        const response = await requestWithGuestSession(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`,
          {
            method: "GET",
          }
        );

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil data keranjang."
          );
        }

        const data = result.data;

        const items: CartItem[] = Array.isArray(data?.items)
          ? data.items
          : [];

        const storedSelectedIds = localStorage.getItem(
          "melody_checkout_selected_item_ids"
        );

        let selectedIds: string[] = [];

        if (storedSelectedIds) {
          try {
            const parsed = JSON.parse(storedSelectedIds);

            if (Array.isArray(parsed)) {
              selectedIds = parsed.filter(
                (id): id is string => typeof id === "string"
              );
            }
          } catch (error) {
            console.error(
              "Data item checkout di localStorage tidak valid:",
              error
            );

            localStorage.removeItem(
              "melody_checkout_selected_item_ids"
            );
          }
        }

        const selectedItems = items.filter((item) =>
          selectedIds.includes(item.id)
        );

        setSelectedItemIds(
          selectedItems.map((item) => item.id)
        );

        setCartItems(selectedItems);

        const selectedSubtotal = selectedItems.reduce(
          (total, item) => total + Number(item.subtotal),
          0
        );

        setCartSubtotal(selectedSubtotal);
      } catch (error) {
        if (cancelled) return;

        console.error("Gagal mengambil data keranjang:", error);

        setCartItems([]);
        setCartSubtotal(0);
        setCartError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data keranjang."
        );
      } finally {
        if (!cancelled) {
          setCartLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [checkoutMode]);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectProduct() {
      if (
        checkoutMode !== "direct" ||
        !directProductId ||
        !directSlug
      ) {
        setDirectItem(null);
        return;
      }

      try {
        const product = await getProductDetail(directSlug);

        if (cancelled) return;

        if (!product || product.id !== directProductId) {
          throw new Error(
            "Produk direct checkout tidak ditemukan."
          );
        }

        const unitPrice =
          Number(product.discount_price) > 0
            ? Number(product.discount_price)
            : Number(product.price);

        setDirectItem({
          product_id: product.id,
          quantity: directQuantity,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            thumbnail:
              product.media?.find(
                (media) =>
                  media.media_type === "image" &&
                  media.is_main
              )?.url ?? null,
            price: Number(product.price),
            discount_price:
              Number(product.discount_price) || 0,
            original_price:
              Number(product.original_price) || 0,
          },
          subtotal: unitPrice * directQuantity,
        });
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Gagal mengambil produk direct checkout:",
          error
        );

        setDirectItem(null);
      }
    }

    loadDirectProduct();

    return () => {
      cancelled = true;
    };
  }, [
    checkoutMode,
    directProductId,
    directSlug,
    directQuantity,
  ]);

  useEffect(() => {
    if (checkoutMode === "direct") {
      setCartSubtotal(
        directItem?.subtotal ?? 0
      );
    }
  }, [checkoutMode, directItem]);

  const clearVoucher = () => {
    setVoucherCode("");
    setVoucherDiscount(0);
    setVoucherValid(false);
    setVoucherMessage("");
  };

    useEffect(() => {
    if (checkoutMode !== "direct") {
      return;
    }

    if (!directItem) {
      setCartItems([]);
      setCartSubtotal(0);
      return;
    }

    setCartItems([
      {
        id: `direct-${directItem.product_id}`,
        quantity: directItem.quantity,
        unit_price: String(
          directItem.subtotal / directItem.quantity
        ),
        subtotal: directItem.subtotal,
        product: {
          id: directItem.product.id,
          name: directItem.product.name,
          slug: directItem.product.slug,
          thumbnail: directItem.product.thumbnail,
          stock: 0,
          is_sale:
            Number(
              directItem.product.discount_price
            ) > 0,
        },
      },
    ]);

    setCartSubtotal(directItem.subtotal);
  }, [checkoutMode, directItem]);

  const applyVoucher = async () => {
    const code = voucherCode.trim();

    if (!code) {
      setVoucherValid(false);
      setVoucherDiscount(0);
      setVoucherMessage("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    try {
      setVoucherLoading(true);
      setVoucherMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vouchers/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            code,
            subtotal: cartSubtotal,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memeriksa voucher."
        );
      }

      if (!result.valid) {
        setVoucherValid(false);
        setVoucherDiscount(0);
        setVoucherMessage(
          result.message || "Voucher tidak tersedia."
        );
        return;
      }

      setVoucherValid(true);
      setVoucherDiscount(Number(result.estimated_discount) || 0);
      setVoucherMessage(
        result.message || "Voucher berhasil diterapkan."
      );
    } catch (error) {
      console.error("Gagal memeriksa voucher:", error);

      setVoucherValid(false);
      setVoucherDiscount(0);
      setVoucherMessage(
        error instanceof Error
          ? error.message
          : "Gagal memeriksa voucher."
      );
    } finally {
      setVoucherLoading(false);
    }
  };

  /**
   * Hitung ongkir berdasarkan regency yang dipilih.
   *
   * Backend:
   * POST /api/shipping/estimate-all
   *
   * Request:
   * {
   *   "regency_id": "1102"
   * }
   */
  useEffect(() => {
    let cancelled = false;

    async function calculateShipping() {
      /**
       * Jika kota/kabupaten belum dipilih,
       * tidak perlu melakukan request ongkir.
       */
      if (!fields.regency_id) {
        setShippingOptions([]);
        setShippingState("");
        setShippingError("");
        setShippingLoading(false);

        return;
      }

      try {
        setShippingLoading(true);
        setShippingError("");
        setShippingState("");

        const response = await requestWithGuestSession(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipping/estimate-all`,
          {
            method: "POST",
            body: JSON.stringify({
              regency_id: fields.regency_id,
              ...(checkoutMode === "direct" &&
                directItem && {
                  items: [
                    {
                      product_id: directItem.product_id,
                      quantity: directItem.quantity,
                    },
                  ],
                }),
            }),
          }
        );

        const result = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal menghitung ongkir."
          );
        }

        const options: ShippingOption[] =
          Array.isArray(result.data?.couriers)
            ? result.data.couriers
            : [];

        setShippingOptions(options);

        /**
         * Untuk sementara pilih courier available pertama
         * agar state shipping tetap memiliki nilai.
         *
         * Pada Step 2B, pemilihan ini akan kita serahkan
         * sepenuhnya kepada user melalui ShippingMethodOptions.
         */
        const firstAvailable = options.find(
          (option) =>
            option.available &&
            option.fee !== null
        );

        if (firstAvailable) {
          setShippingState(
            firstAvailable.courier_code
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Gagal menghitung ongkir:",
          error
        );

        setShippingOptions([]);
        setShippingState("");

        setShippingError(
          error instanceof Error
            ? error.message
            : "Gagal menghitung ongkir."
        );
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    }

    calculateShipping();

    return () => {
      cancelled = true;
    };
  }, [
    fields.regency_id,
    checkoutMode,
    directItem,
  ]);

  const value = useMemo<Ctx>(
    () => ({
      fields,
      setField: (k, v) => {
        setFields((f) => ({ ...f, [k]: v }));
        setErrors((e) => ({ ...e, [k]: "" }));
      },

      errors,

      setError: (k, v) =>
        setErrors((e) => ({ ...e, [k]: v })),

      shipping,

      setShipping: (v) => {
        setShippingState(v);
        setErrors((e) => ({ ...e, shipping: "" }));
      },

      setVoucherCode: (value) => {
        setVoucherCode(value);
        setVoucherMessage("");
      },

      shippingOptions,
      shippingLoading,
      shippingError,
      selectedShippingFee,
      voucherCode,
      voucherDiscount,
      voucherValid,
      voucherMessage,
      voucherLoading,
      applyVoucher,
      clearVoucher,
      cartItems,
      cartSubtotal,
      cartLoading,
      cartError,
      selectedItemIds,
      checkoutMode,
      directItem,

      validateAll: () => {
        const next: Ctx["errors"] = {};

        (
          Object.keys(
            REQUIRED_LABELS
          ) as (keyof CheckoutFields)[]
        ).forEach((k) => {
          if (!fields[k].trim()) {
            next[k] =
              REQUIRED_LABELS[k] ??
              "Wajib diisi.";
          }
        });

        if (
          fields.phone.trim() &&
          fields.phone.replace(/\D/g, "").length < 9
        ) {
          next.phone =
            "Nomor telepon tidak valid.";
        }

        if (
          fields.email.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            fields.email.trim()
          )
        ) {
          next.email =
            "Format e-mail tidak valid.";
        }

        if (!shipping) {
          next.shipping =
            "Pilih metode pengiriman terlebih dahulu.";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
      },
    }),
    [
      fields,
      errors,
      shipping,
      shippingOptions,
      shippingLoading,
      shippingError,
      selectedShippingFee,
      voucherCode,
      voucherDiscount,
      voucherValid,
      voucherMessage,
      voucherLoading,
      cartItems,
      cartSubtotal,
      cartLoading,
      cartError,
      selectedItemIds,
      checkoutMode,
      directItem,
    ],
  );

  return value;
}

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useCheckoutStore();

  return (
    <CheckoutCtx.Provider value={value}>
      {children}
    </CheckoutCtx.Provider>
  );
}

// ======================================================
// SHIPPING METHOD
// ======================================================

/**
 * Untuk Step 2A, UI ini sengaja masih menggunakan
 * data hardcoded lama.
 *
 * Pada Step 2B akan diganti menggunakan:
 * shippingOptions
 */

export function ShippingMethodOptions() {
  const {
    shipping,
    setShipping,
    shippingOptions,
    shippingLoading,
    shippingError,
  } = useCheckout();

  if (shippingLoading) {
    return (
      <section className="rounded-xl border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-textDark md:text-lg">
          Metode Pengiriman
        </h2>

        <div className="py-6 text-center text-sm text-gray-500">
          Menghitung ongkir...
        </div>
      </section>
    );
  }

  if (shippingError) {
    return (
      <section className="rounded-xl border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-textDark md:text-lg">
          Metode Pengiriman
        </h2>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {shippingError}
        </div>
      </section>
    );
  }

  if (!shippingOptions.length) {
    return (
      <section className="rounded-xl border border-border-subtle bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-textDark md:text-lg">
          Metode Pengiriman
        </h2>

        <div className="py-6 text-center text-sm text-gray-500">
          Pilih kabupaten/kota terlebih dahulu untuk melihat metode pengiriman.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border-subtle bg-white p-5">
      <h2 className="mb-4 text-base font-bold text-textDark md:text-lg">
        Metode Pengiriman
      </h2>

      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const isSelected = shipping === option.courier_code;
          const isAvailable =
            option.available && option.fee !== null;

          return (
            <button
              key={option.courier_id}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable) {
                  setShipping(option.courier_code);
                }
              }}
              className={`w-full rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-black bg-gray-50"
                  : "border-border-subtle bg-white hover:border-gray-400"
              } ${
                !isAvailable
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-black"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-black" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-textDark">
                      {option.courier_name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Layanan {option.service}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isAvailable ? (
                    <p className="font-semibold text-textDark">
                      Rp {option.fee!.toLocaleString("id-ID")}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-500">
                      Tidak tersedia
                    </p>
                  )}
                </div>
              </div>

              {isAvailable && option.weight !== null && (
                <p className="mt-2 ml-8 text-xs text-gray-500">
                  Berat pengiriman {option.weight} kg
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ======================================================
// VOUCHER
// ======================================================

export function VoucherBox() {
  const {
    voucherCode,
    voucherDiscount,
    voucherValid,
    voucherMessage,
    voucherLoading,
    setVoucherCode,
    applyVoucher,
    clearVoucher,
  } = useCheckout();

  return (
    <div>
      <h4 className="text-sm font-bold text-textDark mb-3">
        Voucher
      </h4>

      <div className="flex gap-2">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Masukkan kode voucher"
          disabled={voucherLoading}
          className="flex-1 rounded-lg border border-border-subtle px-3 py-2.5 text-sm outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={applyVoucher}
          disabled={voucherLoading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {voucherLoading ? "..." : "Gunakan"}
        </button>
      </div>

      {voucherMessage && (
        <div
          className={`mt-2 text-xs font-medium ${
            voucherValid
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {voucherMessage}
        </div>
      )}

      {voucherValid && voucherDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-textMuted">
            Diskon voucher
          </span>

          <span className="font-semibold text-green-600">
            - Rp {voucherDiscount.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {voucherValid && (
        <button
          type="button"
          onClick={clearVoucher}
          className="mt-2 text-xs font-medium text-textMuted underline hover:text-primary"
        >
          Hapus voucher
        </button>
      )}
    </div>
  );
}

// ======================================================
// PLACE ORDER
// ======================================================

export function PlaceOrderButton() {
  const router = useRouter();

  const {
    fields,
    validateAll,
    shipping,
    voucherCode,
    selectedItemIds,
    cartItems,
    checkoutMode,
    directItem,
    setError,
  } = useCheckout();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handlePlaceOrder = async () => {
    setSubmitError("");

    const isValid = validateAll();

    if (!isValid) {
      return;
    }

    if (checkoutMode === "cart") {
      if (!cartItems.length || !selectedItemIds.length) {
        setSubmitError(
          "Tidak ada item yang dipilih untuk checkout."
        );
        return;
      }
    }

    if (checkoutMode === "direct" && !directItem) {
      setSubmitError(
        "Produk yang akan dibeli tidak ditemukan."
      );
      return;
    }

    if (!shipping) {
      setSubmitError("Silakan pilih metode pengiriman.");
      return;
    }

    setLoading(true);

    try {
      const basePayload = {
        name: fields.nama,
        email: fields.email || null,
        phone: fields.phone,
        courier: shipping,
        shipping_address: {
          recipient_name: fields.nama,
          phone: fields.phone,
          regency_id: fields.regency_id,
          area: fields.kecamatan,
          address: fields.alamat,
          postal_code: fields.kodePos,
        },
        voucher_code: voucherCode.trim() || null,
      };

      const payload =
        checkoutMode === "direct"
          ? {
              ...basePayload,
              items: [
                {
                  product_id: directItem!.product_id,
                  quantity: directItem!.quantity,
                },
              ],
            }
          : {
              ...basePayload,
              selected_item_ids: selectedItemIds,
            };

      const endpoint =
        checkoutMode === "direct"
          ? "/checkout/direct"
          : "/checkout";

      const response = await requestWithGuestSession(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result?.errors) {
          const firstError = Object.values(result.errors)
            .flat()
            .find(
              (message) =>
                typeof message === "string"
            );

          setSubmitError(
            firstError ||
              result?.message ||
              "Data checkout tidak valid."
          );
        } else {
          setSubmitError(
            result?.message ||
              "Checkout gagal. Silakan coba lagi."
          );
        }

        return;
      }

      const order = result?.data;

      if (!order?.tracking_token) {
        setSubmitError(
          "Pesanan berhasil dibuat, tetapi tracking token tidak ditemukan."
        );
        return;
      }

      localStorage.removeItem(
        "melody_checkout_selected_item_ids"
      );

      router.push(
        `/payment?tracking_token=${encodeURIComponent(
          order.tracking_token
        )}`
      );
    } catch (error) {
      console.error("Checkout error:", error);

      setSubmitError(
        "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition ${
          loading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {loading
          ? "Memproses Pesanan..."
          : "Buat Pesanan"}
      </button>
    </div>
  );
}