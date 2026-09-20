// components/ProductGallery.tsx
'use client';

import { useState, useRef, TouchEvent } from "react";

interface MediaItem {
  type: string;
  url: string;
  alt: string;
}

export function ProductGallery({ mediaList }: { mediaList: MediaItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const handleTouchStart = (e: TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div
          className="relative bg-white rounded-lg overflow-hidden aspect-square border border-borderColor shadow-sm select-none cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full h-full overflow-hidden touch-pan-y">
            <div
              className="flex h-full transition-transform duration-300 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {mediaList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => item.type === "video" ? setLightboxVideo(item.url) : setLightboxImage(item.url)}
                  className="w-full h-full shrink-0 flex items-center justify-center bg-white relative group"
                >
                  {item.type === "video" ? (
                    <video className="max-w-full max-h-full" autoPlay muted loop playsInline>
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img className="w-full h-full object-cover" src={item.url} alt={item.alt} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {mediaList.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}
        </div>

        {mediaList.length > 1 && (
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {mediaList.map((item, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer bg-white rounded overflow-hidden aspect-square transition-all border-2 ${
                  currentIndex === index ? "border-primary opacity-100 scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {item.type === "video" ? (
                  <video className="w-full h-full object-contain pointer-events-none" muted preload="metadata">
                    <source src={item.url} type="video/mp4" />
                  </video>
                ) : (
                  <img className="w-full h-full object-cover" src={item.url} alt={`Thumb ${index}`} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Fokus Produk" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}

      {lightboxVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxVideo(null)}>
          <video className="max-w-[90vw] max-h-[90vh] rounded-lg" controls autoPlay playsInline>
            <source src={lightboxVideo} type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
}