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

const tileClasses = [
  "lg:col-span-6 lg:row-span-2",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-4 lg:row-span-3",
  "lg:col-span-8 lg:row-span-2",
  "lg:col-span-4 lg:row-span-2",
];

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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[180px]"
      >
        {media.map((item, i) => {
          const isVideo = isVideoMedia(item);

          return (
            <li
              key={`${item.src}-${i}`}
              className={tileClasses[i % tileClasses.length]}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Open ${title} ${
                  isVideo ? "video" : "image"
                } ${i + 1} of ${media.length}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden border border-line bg-card transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:border-accent sm:h-full sm:aspect-auto"
              >
                {isVideo ? (
                  <ProjectVideoPreview
                    media={item}
                    title={title}
                    index={i}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `${title} image ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}

                <span className="absolute right-3 top-3 z-10 border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-white backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {!isVideo && (
                  <span className="absolute bottom-3 left-3 z-10 border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-micro backdrop-blur">
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
