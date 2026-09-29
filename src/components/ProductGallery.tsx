'use client';

import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";

interface MediaItem {
  id: string;
  type: string;
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  mediaList: MediaItem[];
  selectedMediaId?: string | null;
}

export function ProductGallery({
  mediaList,
  selectedMediaId,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<string | null>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  /*
   * Ketika selectedMediaId berubah karena customer memilih varian,
   * cari media tersebut di mediaList dan pindahkan gallery ke index-nya.
   *
   * Urutan mediaList TIDAK diubah di sini.
   */
  useEffect(() => {
    if (!selectedMediaId) {
      return;
    }

    const selectedIndex = mediaList.findIndex(
      (media) => media.id === selectedMediaId
    );

    if (selectedIndex !== -1) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedMediaId, mediaList]);

  /*
   * Pastikan currentIndex tetap valid apabila jumlah media berubah.
   */
  useEffect(() => {
    if (mediaList.length === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      if (prev >= mediaList.length) {
        return 0;
      }

      return prev;
    });
  }, [mediaList.length]);

  const nextSlide = () => {
    if (mediaList.length <= 1) {
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prevSlide = () => {
    if (mediaList.length <= 1) {
      return;
    }

    setCurrentIndex(
      (prev) => (prev - 1 + mediaList.length) % mediaList.length
    );
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  /*
   * Tidak ada media.
   */
  if (mediaList.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* MAIN GALLERY */}
        <div
          className="relative bg-white rounded-lg overflow-hidden aspect-square border border-borderColor shadow-sm select-none cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full h-full overflow-hidden touch-pan-y">
            <div
              className="flex h-full transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {mediaList.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => {
                    if (item.type === "video") {
                      setLightboxVideo(item.url);
                    } else {
                      setLightboxImage(item.url);
                    }
                  }}
                  className="w-full h-full shrink-0 flex items-center justify-center bg-white relative group"
                >
                  {item.type === "video" ? (
                    <video
                      className="max-w-full max-h-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={item.url}
                      alt={item.alt}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP PREVIOUS / NEXT */}
          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30"
                aria-label="Foto sebelumnya"
              >
                <span className="material-symbols-outlined">
                  chevron_left
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg items-center justify-center z-30"
                aria-label="Foto berikutnya"
              >
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        {mediaList.length > 1 && (
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {mediaList.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer bg-white rounded overflow-hidden aspect-square transition-all border-2 ${
                  currentIndex === index
                    ? "border-primary opacity-100 scale-[1.02]"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`Lihat media ${index + 1}`}
              >
                {item.type === "video" ? (
                  <video
                    className="w-full h-full object-contain pointer-events-none"
                    muted
                    preload="metadata"
                  >
                    <source src={item.url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={item.url}
                    alt={`Thumb ${index + 1}`}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* IMAGE LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Fokus Produk"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
          />
        </div>
      )}

      {/* VIDEO LIGHTBOX */}
      {lightboxVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxVideo(null)}
        >
          <video
            className="max-w-[90vw] max-h-[90vh] rounded-lg"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          >
            <source src={lightboxVideo} type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
}