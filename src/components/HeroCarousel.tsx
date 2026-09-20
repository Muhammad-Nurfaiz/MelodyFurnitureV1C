'use client';

import { useState, useEffect, useCallback } from "react";
import { HeroSlide } from "@/types";
import { getImageUrl } from "@/lib/utils";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const sortedSlides = [...slides].sort((a, b) => a.sort_order - b.sort_order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedSlides.length);
  }, [sortedSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedSlides.length) % sortedSlides.length);
  }, [sortedSlides.length]);

  useEffect(() => {
    if (sortedSlides.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedSlides.length, isHovered, nextSlide]);

  if (sortedSlides.length === 0) return null;

  return (
    <section 
      className="bg-white p-3 md:p-5 rounded-lg mb-5 shadow-sm relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full min-h-[360px] md:min-h-[580px] relative rounded-md overflow-hidden bg-gray-900">
        {sortedSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          const slideImageUrl = getImageUrl(slide.image);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center text-center p-4 md:p-8 bg-cover bg-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("${slideImageUrl}")`,
              }}
            >
              {slide.eyebrow && (
                <span className="text-secondary font-semibold text-xs md:text-sm tracking-wider uppercase mb-2 animate-fadeIn">
                  {slide.eyebrow}
                </span>
              )}
              <h1 className="text-white font-extrabold text-xl md:text-3xl max-w-[850px] leading-snug mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-xs md:text-base max-w-[750px] mb-6 font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                <a
                  href={slide.button_url || "#"}
                  className="bg-secondary text-white px-7 py-3 rounded font-bold cursor-pointer shadow-lg hover:bg-opacity-90 transition text-sm text-center"
                >
                  {slide.button_text || "Lihat Detail"}
                </a>
                <a
                  href="/produk"
                  className="bg-white/15 text-white border-2 border-white px-6 py-2.5 rounded font-bold cursor-pointer hover:bg-white/25 transition backdrop-blur-sm text-sm text-center"
                >
                  Lihat Katalog Pabrik
                </a>
              </div>
            </div>
          );
        })}

        {sortedSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 focus:outline-none"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 focus:outline-none"
              aria-label="Next Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {sortedSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {sortedSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-7 bg-secondary" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}