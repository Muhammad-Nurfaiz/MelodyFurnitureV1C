'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Interface disesuaikan dengan skema JSON dari API
export interface PromoBanner {
  id: string;
  image: string;
  url: string;
  alt: string;
  sort_order: number;
}

// Data Dummy Banner menggunakan Placeholder dengan rasio 2:1 (600x300)
const DUMMY_BANNERS: PromoBanner[] = [
  {
    id: "019fd78e-3e39-716a-ba9d-afaf49d10646",
    image: "https://placehold.co/600x300/1B4F9C/FFFFFF/png?text=Promo+Diskon+40%25",
    url: "/events",
    alt: "Promo Diskon 40%",
    sort_order: 1,
  },
  {
    id: "019fd7d1-d441-718f-bb44-3cb2c9e4400e",
    image: "https://placehold.co/600x300/E2542C/FFFFFF/png?text=Gratis+Ongkir",
    url: "/events",
    alt: "Gratis Ongkir Se-Indonesia",
    sort_order: 2,
  },
  {
    id: "019fd782-e676-7033-bd73-617822a73dc9",
    image: "https://placehold.co/600x300/0F766E/FFFFFF/png?text=Flash+Sale+Furnitur",
    url: "/events",
    alt: "Flash Sale Furnitur",
    sort_order: 3,
  },
  {
    id: "019fd782-e676-7033-bd73-617822a73dca",
    image: "https://placehold.co/600x300/4E46E5/FFFFFF/png?text=Cicilan+0%25+12+Bulan",
    url: "/events",
    alt: "Cicilan 0%",
    sort_order: 4,
  },
];

function groupBanners(banners: PromoBanner[], perSlide: number): PromoBanner[][] {
  const out: PromoBanner[][] = [];
  for (let i = 0; i < banners.length; i += perSlide) {
    out.push(banners.slice(i, i + perSlide));
  }
  return out;
}

function PromoSkeleton({ perSlide, slidesCount }: { perSlide: number; slidesCount: number }) {
  return (
    <section className="mb-5" aria-label="Memuat banner promo" aria-busy="true">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="h-5 md:h-6 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="flex gap-3 md:gap-4 px-0.5">
        {Array.from({ length: perSlide }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-gray-200 animate-pulse aspect-[2/1]"
            style={{ width: perSlide === 1 ? "100%" : "50%" }}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {Array.from({ length: slidesCount }).map((_, i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
        ))}
      </div>
      <span className="sr-only">Memuat banner promo…</span>
    </section>
  );
}

interface PromoCarouselProps {
  banners?: PromoBanner[];
}

export function PromoCarousel({ banners = DUMMY_BANNERS }: PromoCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const isMobile = useIsMobile();
  const perSlide = isMobile ? 1 : 2;

  // Mengurutkan data berdasarkan sort_order jika ada
  const sortedBanners = useMemo(() => {
    return [...banners].sort((a, b) => a.sort_order - b.sort_order);
  }, [banners]);

  const slides = useMemo(
    () => groupBanners(sortedBanners, perSlide),
    [sortedBanners, perSlide]
  );

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIndex(0);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: 0, behavior: "auto" });
  }, [perSlide]);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (i + slides.length) % slides.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
      setIndex(next);
    },
    [slides.length]
  );

  // Auto-play 15 detik
  useEffect(() => {
    if (!ready || slides.length <= 1) return;

    const interval = setInterval(() => {
      goTo(index + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, [goTo, index, ready, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIndex(Math.round(track.scrollLeft / (track.clientWidth || 1)));
      }, 90);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      track.removeEventListener("scroll", onScroll);
    };
  }, [slides.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(slides.length - 1);
    }
  };

  if (!ready) return <PromoSkeleton perSlide={perSlide} slidesCount={slides.length} />;

  if (!sortedBanners.length) return null;

  return (
    <section
      className="mb-5"
      role="region"
      aria-roledescription="carousel"
      aria-label="Banner Promo Melody"
    >
      <style>{`#promoTrack::-webkit-scrollbar{display:none}#promoTrack{scrollbar-width:none;-ms-overflow-style:none}`}</style>

      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base md:text-xl font-extrabold text-textDark">
          Promo Spesial Melody
        </h2>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Banner sebelumnya"
          aria-controls="promoTrack"
          onClick={() => goTo(index - 1)}
          disabled={index <= 0}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-borderColor text-primary hover:bg-primary hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          id="promoTrack"
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-roledescription="daftar slide"
          aria-label="Slide banner promo, gunakan panah kiri dan kanan"
          onKeyDown={onKeyDown}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {slides.map((slide, si) => (
            <div
              key={si}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${si + 1} dari ${slides.length}`}
              aria-hidden={si !== index}
              className={`snap-start shrink-0 w-full flex gap-3 md:gap-4 px-0.5 ${
                slide.length < perSlide ? "justify-center" : ""
              }`}
            >
              {slide.map((banner) => (
                <a
                  key={banner.id}
                  href={banner.url || "#"}
                  className={`block relative overflow-hidden rounded-lg shadow-sm hover:opacity-95 transition group ${
                    perSlide === 1 ? "w-full" : "w-1/2"
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.alt || "Banner Promo"}
                    className="w-full h-auto aspect-[2/1] object-cover rounded-lg group-hover:scale-[1.01] transition-transform duration-300"
                  />
                </a>
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Banner berikutnya"
          aria-controls="promoTrack"
          onClick={() => goTo(index + 1)}
          disabled={index >= slides.length - 1}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-11 h-11 items-center justify-center rounded-full bg-white shadow-lg border border-borderColor text-primary hover:bg-primary hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-3" role="tablist" aria-label="Pilih slide promo">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-current={i === index ? "true" : undefined}
            aria-label={`Ke slide ${i + 1} dari ${slides.length}`}
            onClick={() => goTo(i)}
            className="p-2 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-primary" : "w-2 bg-gray-400 hover:bg-gray-500"
              }`}
            />
          </button>
        ))}
      </div>

      <div aria-live="polite" className="sr-only">
        Slide {index + 1} dari {slides.length}
      </div>
    </section>
  );
}