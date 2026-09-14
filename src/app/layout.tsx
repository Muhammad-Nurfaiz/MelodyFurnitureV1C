import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Melody Furniture | Toko Mebel & Furnitur Rumah Minimalis",
  description:
    "Melody Furniture - furnitur rumah minimalis, meja belajar, lemari, dan rak TV kualitas internasional dengan harga terbaik.",
  authors: [{ name: "Melody Furniture" }],
  openGraph: {
    title: "Melody Furniture",
    description: "Furnitur rumah minimalis berkualitas internasional.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Tailwind theme untuk halaman shop (default global).
// Beberapa halaman (admin/cart/checkout/payment/track) akan meng-override
// via applyTailwindTheme() di LegacyPage pada sisi client.
const TAILWIND_THEME_SCRIPT = `
(function(){
  var shopTheme = {
    theme:{
      extend:{
        colors:{
          primary:"#111d3d",
          secondary:"#E14D2A",
          bgLight:"#F8F9FA",
          textDark:"#212529",
          textMuted:"#6C757D",
          borderColor:"#E9ECEF"
        }
      }
    }
  };
  window.__ready=function(f){f()};
  window.__pendingTheme=shopTheme;
  document.addEventListener('DOMContentLoaded',function(){
    if(window.tailwind){window.tailwind.config=shopTheme;}
  });
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Tailwind CDN (tema di-inject via script di bawah) */}
        {/* Inject default shop theme sebelum Tailwind CDN dijalankan */}
        <script dangerouslySetInnerHTML={{ __html: TAILWIND_THEME_SCRIPT }} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
