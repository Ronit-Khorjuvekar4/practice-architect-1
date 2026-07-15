"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type {
  CompetitionDetails,
  CompetitionImage,
  CompetitionSummary,
} from "@/types/competition";

type CompetitionStageProps = {
  summary: CompetitionSummary;
  details: CompetitionDetails | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

function StageImage({ image }: { image: CompetitionImage }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      loading="lazy"
      sizes="(max-width: 1023px) 100vw, (max-width: 1360px) 64vw, 780px"
      onLoad={() => setIsLoaded(true)}
      className={`object-contain transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export function CompetitionStage({
  summary,
  details,
  isLoading,
  error,
  onRetry,
}: CompetitionStageProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const images = details?.images ?? [summary.coverImage];
  const safeIndex = Math.min(imageIndex, images.length - 1);
  const currentImage = images[safeIndex];
  const hasMultipleImages = images.length > 1;
  const displayedTotal = details?.images.length ?? summary.imageCount;

  const showPrevious = () => {
    setImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <article
      tabIndex={0}
      aria-label={`${summary.title} competition gallery`}
      onKeyDown={(event) => {
        if (!hasMultipleImages) return;

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      }}
      className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] border border-line-strong bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div
        className="relative min-h-[340px] overflow-hidden bg-panel sm:min-h-[440px] lg:min-h-0"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStartRef.current;
          const touch = event.changedTouches[0];
          touchStartRef.current = null;

          if (!start || !hasMultipleImages) return;

          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
          }

          if (deltaX > 0) showPrevious();
          else showNext();
        }}
      >
        <StageImage key={currentImage.id} image={currentImage} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        />

        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 z-10 flex gap-2 sm:bottom-5 sm:right-5">
            <button
              type="button"
              onClick={showPrevious}
              aria-label={`Show previous image for ${summary.title}`}
              className="flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-button-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={`Show next image for ${summary.title}`}
              className="flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-button-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {isLoading && (
          <span role="status" className="absolute left-4 top-4 z-10 border border-line-strong bg-paper/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted backdrop-blur">
            Loading gallery…
          </span>
        )}

        {error && (
          <div role="alert" className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-4 border border-line-strong bg-paper/95 p-3 backdrop-blur sm:inset-x-auto sm:left-5 sm:right-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Gallery unavailable
            </span>
            <button
              type="button"
              onClick={onRetry}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-white underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <footer className="grid gap-5 border-t border-line-strong p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
        <div className="min-w-0">
          <h3 aria-live="polite" className="mt-2 truncate font-serif text-2xl uppercase leading-tight text-white sm:text-3xl">
            {summary.title}
          </h3>
        </div>
        <span
          aria-live="polite"
          className="font-mono text-[11px] tracking-[0.2em] text-muted"
        >
          {String(safeIndex + 1).padStart(2, "0")} /{" "}
          {String(displayedTotal).padStart(2, "0")}
        </span>
      </footer>
    </article>
  );
}
