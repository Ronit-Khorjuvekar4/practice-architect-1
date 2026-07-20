"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  GalleryLightbox,
  type GalleryLightboxItem,
} from "@/components/ui/GalleryLightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/lib/achievements";
import { cn } from "@/lib/utils";

const CAROUSEL_IMAGE_SIZES =
  "(max-width: 639px) 78vw, (max-width: 1023px) 50vw, (max-width: 1360px) 25vw, 300px";
const MAX_VISIBLE_INDICATORS = 12;

const achievementLightboxMedia: GalleryLightboxItem[] = achievements.map(
  (item) => ({
    type: "image",
    src: item.image,
    alt: item.title,
    title: item.title,
  }),
);

function getVisibleIndicatorIndexes(total: number, activeIndex: number) {
  const visibleCount = Math.min(total, MAX_VISIBLE_INDICATORS);
  const start = Math.min(
    Math.max(activeIndex - Math.floor(visibleCount / 2), 0),
    total - visibleCount,
  );

  return Array.from({ length: visibleCount }, (_, offset) => start + offset);
}

const AchievementSlides = memo(function AchievementSlides({
  onOpen,
}: {
  onOpen: (index: number) => void;
}) {
  return (
    <ul className="-ml-6 flex">
      {achievements.map((item, index) => (
        <li
          key={item.image}
          className="min-w-0 shrink-0 basis-[78%] pl-6 sm:basis-1/2 lg:basis-1/4"
        >
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Open achievement image ${index + 1} of ${achievements.length}: ${item.title}`}
            className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-line-strong bg-panel p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              loading="lazy"
              sizes={CAROUSEL_IMAGE_SIZES}
              draggable={false}
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
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
export function AchievementsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
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
  const total = achievements.length;
  const indicatorIndexes = getVisibleIndicatorIndexes(total, activeIndex);

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
              <AchievementSlides onOpen={openLightbox} />
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {String(activeIndex + 1).padStart(2, "0")} — of{" "}
                {String(total).padStart(2, "0")}
              </span>

              <div className="hidden gap-2 sm:flex" aria-hidden="true">
                {indicatorIndexes.map((index) => (
                  <button
                    key={achievements[index].image}
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
          media={achievementLightboxMedia}
          title="Achievements"
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
