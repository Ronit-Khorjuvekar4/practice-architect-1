"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { achievements } from "@/lib/achievements";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

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
        delay: 2000, // 3 seconds
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const total = achievements.length;

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

  return (
    <section className="border-b border-line-strong bg-panel">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
        <SectionHeading
          index="02"
          eyebrow="Recognitions"
          title="Achievements"
          description="Awards, fellowships and publications from across the practice."
        />

        <div className="mt-12 border border-line-strong bg-card p-5 md:p-8">
          <div ref={emblaRef} className="overflow-hidden">
            <ul className="flex gap-6">
              {achievements.map((item) => (
                <li
                  key={item.title}
                  className="flex min-w-0 shrink-0 basis-[78%] flex-col gap-4 sm:basis-[calc(50%_-_12px)] lg:basis-[calc(25%_-_18px)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden border border-line-strong bg-panel">
                    <Image
                      src={item.image}
                      alt={`${item.title}, ${item.year}`}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-lg leading-tight">
                      {item.title}
                    </span>
                    <span className="font-mono text-[12px] text-muted">
                      {item.year}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {item.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {String(activeIndex + 1).padStart(2, "0")} — of{" "}
              {String(total).padStart(2, "0")}
            </span>

            <div className="hidden gap-2 sm:flex" aria-hidden="true">
              {achievements.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  tabIndex={-1}
                  aria-label={`Go to achievement ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-0.5 w-6 transition-colors",
                    i === activeIndex ? "bg-accent" : "bg-line hover:bg-muted",
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
  );
}
