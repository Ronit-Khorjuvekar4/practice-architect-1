"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/types/project";
import { isVideoMedia } from "@/lib/media";
import { ProjectLightbox } from "@/components/project/ProjectLightbox";
import { ProjectVideoPreview } from "@/components/project/ProjectVideoPreview";

type ProjectHeroMediaProps = {
  media: ProjectMedia[];
  title: string;
  categoryLabel: string;
};

export function ProjectHeroMedia({
  media,
  title,
  categoryLabel,
}: ProjectHeroMediaProps) {
  const [featuredMedia] = media;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!featuredMedia) {
    return <div className="absolute inset-0 bg-panel" aria-hidden="true" />;
  }

  const isVideo = isVideoMedia(featuredMedia);

  return (
    <>
      {isVideo ? (
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          aria-label={`Open ${title} featured project video`}
          className="group absolute inset-0 text-left"
        >
          <ProjectVideoPreview
            media={featuredMedia}
            title={title}
            sizes="(max-width: 1600px) 100vw, 1600px"
            priority
          />
        </button>
      ) : (
        <Image
          src={featuredMedia.src}
          alt={featuredMedia.alt ?? `${title} featured project image`}
          fill
          priority
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="object-cover"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-black/20"
        aria-hidden="true"
      />
      <span
        aria-hidden="true"
        className="absolute left-[-1px] top-[-1px] h-4 w-4 border-l border-t border-accent"
      />
      <span
        aria-hidden="true"
        className="absolute right-[-1px] top-[-1px] h-4 w-4 border-r border-t border-accent"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-[-1px] h-4 w-4 border-b border-l border-accent"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] right-[-1px] h-4 w-4 border-b border-r border-accent"
      />
      <figcaption
        className={`absolute bottom-4 z-30 border border-line-strong bg-paper/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-micro backdrop-blur ${
          isVideo ? "right-4" : "left-4"
        }`}
      >
        {title} / {categoryLabel}
      </figcaption>

      {activeIndex !== null && (
        <ProjectLightbox
          media={media}
          title={title}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      )}
    </>
  );
}
