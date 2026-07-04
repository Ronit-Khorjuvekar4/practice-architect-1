"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/types/project";
import { isVideoMedia } from "@/lib/media";
import { ProjectLightbox } from "@/components/project/ProjectLightbox";
import { ProjectVideoPreview } from "@/components/project/ProjectVideoPreview";

type ProjectGalleryProps = {
  media: ProjectMedia[];
  title: string;
};

/**
 * Matches the responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop.
 * Tells Next.js which source resolution to fetch for each square cell.
 */
const GALLERY_SIZES =
  "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";

export function ProjectGallery({ media, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  const handleClose = () => {
    const opened = activeIndex;
    setActiveIndex(null);

    if (opened !== null) {
      requestAnimationFrame(() => {
        const buttons =
          gridRef.current?.querySelectorAll<HTMLButtonElement>("button");
        buttons?.[opened]?.focus();
      });
    }
  };

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <ul
        ref={gridRef}
        role="list"
        aria-label="Project gallery"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {media.map((item, i) => {
          const isVideo = isVideoMedia(item);
          const isEager = i < 3;

          return (
            <li key={`${item.src}-${i}`} className="min-w-0">
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Open ${title} ${
                  isVideo ? "video" : "image"
                } ${i + 1} of ${media.length}`}
                style={{ backgroundColor: "var(--surface-strong)" }}
                className="group relative block aspect-square w-full cursor-pointer overflow-hidden p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {isVideo ? (
                  <ProjectVideoPreview
                    media={item}
                    title={title}
                    index={i}
                    sizes={GALLERY_SIZES}
                    priority={isEager}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `${title} — image ${i + 1}`}
                    fill
                    quality={85}
                    loading={isEager ? "eager" : "lazy"}
                    priority={isEager}
                    sizes={GALLERY_SIZES}
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    className="transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                  />
                )}

                {/* Hover darken overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] bg-black/0 transition-colors duration-200 group-hover:bg-black/30"
                />

                {/* Index badge — top-right */}
                <span
                  aria-hidden="true"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  className="absolute right-2 top-2 z-[2] px-1.5 py-[3px] text-[10px] leading-none tracking-[0.08em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {activeIndex !== null && (
        <ProjectLightbox
          media={media}
          title={title}
          index={activeIndex}
          onClose={handleClose}
          onIndexChange={setActiveIndex}
        />
      )}
    </>
  );
}
