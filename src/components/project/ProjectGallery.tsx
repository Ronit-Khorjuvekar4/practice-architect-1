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

const GALLERY_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw";

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

  return (
    <>
      <ul
        ref={gridRef}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4"
      >
        {media.map((item, i) => {
          const isVideo = isVideoMedia(item);

          return (
            <li key={`${item.src}-${i}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Open ${title} ${
                  isVideo ? "video" : "image"
                } ${i + 1} of ${media.length}`}
                className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {isVideo ? (
                  <ProjectVideoPreview
                    media={item}
                    title={title}
                    index={i}
                    sizes={GALLERY_SIZES}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `${title} image ${i + 1}`}
                    fill
                    loading="lazy"
                    sizes={GALLERY_SIZES}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                )}

                <span className="absolute right-3 top-3 z-10 rounded-md border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-white backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {!isVideo && (
                  <span className="absolute bottom-3 left-3 z-10 rounded-md border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-micro opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    Photo
                  </span>
                )}
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
