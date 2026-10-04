import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GuestSessionProvider } from "@/components/GuestSessionProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Google Fonts */}

        {/* Tailwind CDN (tema di-inject via script di bawah) */}
        {/* Inject default shop theme sebelum Tailwind CDN dijalankan */}
        <script
          dangerouslySetInnerHTML={{ __html: TAILWIND_THEME_SCRIPT }}
        />

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1089715990506752');
            fbq('track', 'PageView');
          `}
        </Script>

        <link rel="icon" href="favicon.ico" type="image/x-icon" />
      </head>

      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1089715990506752&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <GuestSessionProvider>{children}</GuestSessionProvider>
      </body>
    </html>
  );
}