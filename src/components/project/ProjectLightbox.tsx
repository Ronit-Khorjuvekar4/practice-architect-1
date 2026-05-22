"use client";

import Image from "next/image";
import type { ProjectMedia } from "@/types/project";
import { isVideoMedia } from "@/lib/media";

type ProjectLightboxProps = {
  media: ProjectMedia[];
  title: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ProjectLightbox({
  media,
  title,
  index,
  onClose,
  onIndexChange,
}: ProjectLightboxProps) {
  const item = media[index];
  const isVideo = isVideoMedia(item);

  const goPrevious = () => {
    onIndexChange(index === 0 ? media.length - 1 : index - 1);
  };

  const goNext = () => {
    onIndexChange(index === media.length - 1 ? 0 : index + 1);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project media"
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center border border-line-strong bg-paper text-white"
      >
        X
      </button>

      <button
        type="button"
        onClick={goPrevious}
        aria-label="Show previous project media"
        className="absolute left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-paper text-white"
      >
        &lt;
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="Show next project media"
        className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line-strong bg-paper text-white"
      >
        &gt;
      </button>

      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-full max-h-[86vh] w-full max-w-[1200px]">
          {isVideo ? (
            <video
              key={item.src}
              src={item.src}
              poster={item.thumbnail}
              controls
              playsInline
              preload="metadata"
              aria-label={
                item.title ?? item.alt ?? `${title} video ${index + 1}`
              }
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt ?? `${title} image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
