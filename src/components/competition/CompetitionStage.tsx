"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Competition, CompetitionImage } from "@/types/competition";

type CompetitionStageProps = {
  competition: Competition;
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

export function CompetitionStage({ competition }: CompetitionStageProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const safeIndex = Math.min(imageIndex, competition.images.length - 1);
  const currentImage = competition.images[safeIndex];
  const hasMultipleImages = competition.images.length > 1;

  const showPrevious = () => {
    setImageIndex((current) =>
      current === 0 ? competition.images.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setImageIndex((current) =>
      current === competition.images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <article
      tabIndex={0}
      aria-label={`${competition.name} competition gallery`}
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
              aria-label={`Show previous image for ${competition.name}`}
              className="flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-button-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={`Show next image for ${competition.name}`}
              className="flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-button-text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <footer className="grid gap-5 border-t border-line-strong p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
        <div className="min-w-0">
          <h3 aria-live="polite" className="mt-2 truncate font-serif text-2xl uppercase leading-tight text-white sm:text-3xl">
            {competition.name}
          </h3>
        </div>
        <span
          aria-live="polite"
          className="font-mono text-[11px] tracking-[0.2em] text-muted"
        >
          {String(safeIndex + 1).padStart(2, "0")} /{" "}
          {String(competition.images.length).padStart(2, "0")}
        </span>
      </footer>
    </article>
  );
}
