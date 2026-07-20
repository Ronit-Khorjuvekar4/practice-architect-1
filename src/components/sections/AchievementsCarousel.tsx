"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  GalleryLightbox,
  type GalleryLightboxItem,
} from "@/components/ui/GalleryLightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/photo-gallery";

const CAROUSEL_IMAGE_SIZES =
  "(max-width: 639px) 78vw, (max-width: 1023px) 50vw, (max-width: 1360px) 25vw, 300px";
const MAX_VISIBLE_INDICATORS = 12;

function getVisibleIndicatorIndexes(total: number, activeIndex: number) {
  const visibleCount = Math.min(total, MAX_VISIBLE_INDICATORS);
  const start = Math.min(
    Math.max(activeIndex - Math.floor(visibleCount / 2), 0),
    total - visibleCount,
  );

  return Array.from({ length: visibleCount }, (_, offset) => start + offset);
}

const AchievementSlides = memo(function AchievementSlides({
  images,
  onOpen,
}: {
  images: readonly GalleryImage[];
  onOpen: (index: number) => void;
}) {
  return (
    <ul className="-ml-6 flex">
      {images.map((image, index) => (
        <li
          key={image.id}
          className="min-w-0 shrink-0 basis-[78%] pl-6 sm:basis-1/2 lg:basis-1/4"
        >
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Open achievement image ${index + 1} of ${images.length}: ${image.alternativeText}`}
            className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-line-strong bg-panel p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Image
              src={image.url}
              alt={image.alternativeText}
              fill
              loading="lazy"
              sizes={CAROUSEL_IMAGE_SIZES}
              draggable={false}
              className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        </li>
      ))}
    </ul>
  );
});

/**
 * Homepage Achievements carousel.
 * A scroll-snap track with monochrome prev/next controls and indicators —
 * wraps around at either end for an infinite-loop feel.
 */
type AchievementsCarouselProps = {
  images: GalleryImage[];
};

export function AchievementsCarousel({ images }: AchievementsCarouselProps) {
  const total = images.length;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: total > 1,
    },
    [
      Autoplay({
        delay: 2000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const indicatorIndexes = getVisibleIndicatorIndexes(total, activeIndex);
  const lightboxMedia = useMemo<GalleryLightboxItem[]>(
    () =>
      images.map((image) => ({
        type: "image",
        src: image.url,
        alt: image.alternativeText,
      })),
    [images],
  );

  const updateActiveIndex = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateActiveIndex);
    emblaApi.on("reInit", updateActiveIndex);

    return () => {
      emblaApi.off("select", updateActiveIndex);
      emblaApi.off("reInit", updateActiveIndex);
    };
  }, [emblaApi, updateActiveIndex]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;
    if (!autoplay) return;

    if (lightboxIndex === null) {
      autoplay.play();
    } else {
      autoplay.stop();
    }
  }, [emblaApi, lightboxIndex]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollPrevious = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (total === 0) return null;

  return (
    <>
      <section className="border-b border-line-strong bg-panel">
        <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
          <SectionHeading
            index="02"
            eyebrow="Recognitions"
            title="Photo Gallery"
          />

          <div className="mt-12 border border-line-strong bg-card p-5 md:p-8">
            <div ref={emblaRef} className="overflow-hidden">
              <AchievementSlides images={images} onOpen={openLightbox} />
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {String(activeIndex + 1).padStart(2, "0")} — of{" "}
                {String(total).padStart(2, "0")}
              </span>

              <div className="hidden gap-2 sm:flex" aria-hidden="true">
                {indicatorIndexes.map((index) => (
                  <button
                    key={images[index].id}
                    type="button"
                    tabIndex={-1}
                    aria-label={`Go to achievement ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "h-0.5 w-6 transition-colors",
                      index === activeIndex
                        ? "bg-accent"
                        : "bg-line hover:bg-muted",
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={scrollPrevious}
                  aria-label="Previous achievement"
                  className="flex h-11 w-11 items-center justify-center border border-line text-white transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-button-text"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next achievement"
                  className="flex h-11 w-11 items-center justify-center border border-line text-white transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-button-text"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox
          media={lightboxMedia}
          title="Achievements"
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
