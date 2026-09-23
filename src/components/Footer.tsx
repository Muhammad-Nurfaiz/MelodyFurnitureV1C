'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChatWidget } from "./ChatWidget";

// Interface data sosial media dari API
export interface SocialMediaLinks {
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  whatsapp_url: string | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: SocialMediaLinks;
}

const PAYMENT_METHODS = [
  { name: "American Express", src: "/assets/img/american.webp" },
  { name: "BCA", src: "/assets/img/bca.webp" },
  { name: "BNI", src: "/assets/img/bni.webp" },
  { name: "BRI", src: "/assets/img/bri.webp" },
  { name: "CIMB Niaga", src: "/assets/img/cimb-niaga.webp" },
  { name: "GoPay", src: "/assets/img/gopay.webp" },
  { name: "JCB", src: "/assets/img/jcb.webp" },
  { name: "Kredivo", src: "/assets/img/kredivo.webp" },
  { name: "Mandiri", src: "/assets/img/mandiri.webp" },
  { name: "Mastercard", src: "/assets/img/mastercard.webp" },
  { name: "OVO", src: "/assets/img/ovo.webp" },
  { name: "Permata Bank", src: "/assets/img/permata.webp" },
  { name: "Visa", src: "/assets/img/visa.webp" },
];

const SOCIAL_ICONS: Record<keyof SocialMediaLinks, { name: string; icon: React.ReactNode }> = {
  instagram_url: {
    name: "Instagram",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  facebook_url: {
    name: "Facebook",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
      </svg>
    ),
  },
  tiktok_url: {
    name: "TikTok",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.54-1.28 2.53.02.94.51 1.84 1.3 2.37.83.57 1.91.68 2.86.32 1.05-.38 1.82-1.38 1.93-2.49.07-2.34.02-4.68.03-7.03-.01-3.62.01-7.24-.01-10.86z"/>
      </svg>
    ),
  },
  youtube_url: {
    name: "YouTube",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  whatsapp_url: {
    name: "WhatsApp",
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    ),
  },
};

export function Footer() {
  const [socialData, setSocialData] = useState<SocialMediaLinks | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
        const res = await fetch(`${baseUrl}/home/social-media`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data sosial media");

        const result: ApiResponse = await res.json();
        if (result.success && result.data) {
          setSocialData(result.data);
        }
      } catch (err) {
        console.error("Error fetching social media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  const activeSocials = socialData
    ? (Object.entries(socialData) as [keyof SocialMediaLinks, string | null][]).filter(
        ([_, url]) => url !== null && url.trim() !== ""
      )
    : [];

  return (
    <>
      <footer className="bg-white border-t-4 border-primary pt-10 pb-5 mt-12 text-sm text-[#4a4a4a]">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Kolom 1: Tentang */}
          <div>
            <h4 className="text-textDark font-bold uppercase mb-4 text-xs tracking-wider">
              Tentang Melody
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-textMuted hover:text-secondary transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-textMuted hover:text-secondary transition">
                  Kebijakan Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-textMuted hover:text-secondary transition">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-textMuted hover:text-secondary transition">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Sosial Media */}
          <div>
            <h4 className="text-textDark font-bold uppercase mb-4 text-xs tracking-wider">
              Ikuti Kami
            </h4>
            {loading ? (
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            ) : activeSocials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map(([key, url]) => {
                  const item = SOCIAL_ICONS[key];
                  if (!item || !url) return null;

                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.name}
                      aria-label={item.name}
                      className="w-9 h-9 bg-[#F0F0F0] hover:bg-primary hover:text-white text-textMuted rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      {item.icon}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-textMuted">Sosial media tidak tersedia.</p>
            )}
          </div>

          {/* Kolom 3: Metode Pembayaran */}
          <div>
            <h4 className="text-textDark font-bold uppercase mb-4 text-xs tracking-wider">
              Metode Pembayaran
            </h4>
            <div className="flex flex-wrap gap-2.5 mt-2.5">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="w-[60px] h-[30px] bg-[#F0F0F0] rounded flex items-center justify-center text-[9px] font-bold text-[#999]"
                >
                  <img
                    src={method.src}
                    alt={method.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Kolom 4: Lokasi & Kontak */}
          <div>
            <h4 className="text-textDark font-bold uppercase mb-4 text-xs tracking-wider">
              Lokasi &amp; Kontak
            </h4>
            <img
              src="/assets/img/GM Panjang.png"
              alt="Melody Furniture Logo"
              className="w-1/2 max-w-[180px] mb-2"
            />
            <p className="text-xs text-textMuted mb-2.5">
              Jl. Tegal Mapan no 18, Pakisjajar, Pakis, Malang, Jawa Timur 65154, Indonesia
            </p>
            <div className="w-full h-32 bg-tertiary-container rounded-lg overflow-hidden relative group cursor-pointer border border-tertiary-fixed/10">
              <img
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKOBXzFJ42OrYBBgsqZJdhgFFZSz4n0kaM01t6Ug3agOXWBVnJ-oZ3TXSz351AXQJ7Lx0t6ZmqxvqMJq2M9ZgKIlUWPAv8VjHk1gOHo4-GnkuWaFUGeCVY8En4ibUcCp-U73g-lx9xwNduXAYFAz0toqCyKU-XWv__ok19B1q1KqlmjHCPXBaq1RhGqDPtz1LAhfUy-wTdGCCC5FLRLvsS2Mpau_g499qHCS-36mRePnhahYZgj-lsYgwAPTHO58KVnHAu7oTUUAIg"
                alt="Peta lokasi Melody Furniture"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="https://maps.app.goo.gl/K6x469BJa8TM6URCA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label-sm text-label-sm text-tertiary-fixed bg-tertiary/80 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-warm-oak transition-colors"
                >
                  Lihat Peta
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-borderColor pt-5 text-center text-textMuted text-xs">
          <div className="max-w-[1200px] mx-auto px-4">
            <p>© 2026 Melody Furniture. Seluruh Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}