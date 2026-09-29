'use client'

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

interface ContactBanner {
  id: string;
  imageSrc: string;
  altText: string;
  targetUrl: string;
}

const contactBanners: ContactBanner[] = [
  {
    id: "banner-1",
    imageSrc: "/assets/img/Artboard 12.png",
    altText: "Official Website Lebih Murah 20%",
    targetUrl: "https://melodyfurniture.co.id", // Perbaikan typo: melodyfurniture.co.id
  },
  {
    id: "banner-2",
    imageSrc: "/assets/img/Artboard 14.png",
    altText: "Shopee Official Store",
    targetUrl: "https://id.shp.ee/pZSRRjR3",
  },
  {
    id: "banner-3",
    imageSrc: "/assets/img/Artboard 13.png",
    altText: "Tokopedia Official Store",
    targetUrl: "https://tk.tokopedia.com/ZSbLgUwKJ/",
  },
  {
    id: "banner-4",
    imageSrc: "/assets/img/Artboard 19.png",
    altText: "Tiktok Shop",
    targetUrl: "https://vt.tiktok.com/ZSbLgCJuo/?page=Mall",
  },
  {
    id: "banner-5",
    imageSrc: "/assets/img/Artboard 20.png",
    altText: "Blibli",
    targetUrl: "https://blibli.onelink.me/GNtk/9fh72yhm",
  },
];

export default function ContactUsPage() {
  return (
    <>  
      <Navbar />
      <main className="w-full min-h-screen py-8 md:py-12 select-none">
        <div className="max-w-5xl mx-auto px-4 flex flex-col gap-6 md:gap-8">
          {contactBanners.map((banner) => {
            return (
              <a
                key={banner.id}
                href={banner.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full rounded-2xl overflow-hidden bg-white
                           border-b-4 border-r-2 border-[#111d3d]
                           shadow-[0_8px_20px_rgba(17,29,61,0.2)]
                           transition-all duration-150 ease-out
                           active:translate-y-1 active:border-b-2 active:shadow-[0_2px_8px_rgba(17,29,61,0.3)]
                           hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(17,29,61,0.3)]
                           focus:outline-hidden"
              >
                <img
                  src={banner.imageSrc}
                  alt={banner.altText}
                  className="w-full h-auto block object-contain pointer-events-none"
                  loading="lazy"
                />
              </a>
            );
          })}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}