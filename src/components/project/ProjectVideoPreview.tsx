import Image from "next/image";
import type { ProjectMedia } from "@/types/project";

type ProjectVideoPreviewProps = {
  media: ProjectMedia;
  title: string;
  index?: number;
  sizes: string;
  priority?: boolean;
};

function VideoPlayIcon() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-line-strong bg-paper/85 text-white backdrop-blur transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-button-text"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function ProjectVideoPreview({
  media,
  title,
  index,
  sizes,
  priority = false,
}: ProjectVideoPreviewProps) {
  const previewAlt =
    media.alt ??
    media.title ??
    `${title} video${index !== undefined ? ` ${index + 1}` : ""} thumbnail`;

  return (
    <>
      {media.thumbnail ? (
        <Image
          src={media.thumbnail}
          alt={previewAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <span
          className="absolute inset-0 flex items-end bg-card p-5 text-left"
          aria-label={previewAlt}
          role="img"
        >
          <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_45%),radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),rgba(255,255,255,0)_32%)]" />
          {media.title && (
            <span className="relative z-10 max-w-[22rem] font-serif text-2xl uppercase leading-tight tracking-normal text-white">
              {media.title}
            </span>
          )}
        </span>
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-black/25 transition-colors duration-300 group-hover:bg-black/10"
      />
      <VideoPlayIcon />
      <span className="absolute bottom-3 left-3 z-20 border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-micro backdrop-blur">
        Video
      </span>
    </>
  );
}
