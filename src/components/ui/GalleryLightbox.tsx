"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type GalleryLightboxItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  title?: string;
  thumbnail?: string;
};

type GalleryLightboxProps = {
  media: readonly GalleryLightboxItem[];
  title: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const CLOSE_TRANSITION_MS = 180;
const FOCUSABLE_ELEMENTS =
  'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])';

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1279px) 100vw, 1200px"
      onLoad={() => setIsLoaded(true)}
      className={`object-contain transition-opacity duration-200 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/**
 * Shared, single-item media viewer used by project and achievement galleries.
 * Only the active media item is mounted, regardless of the gallery size.
 */
export function GalleryLightbox({
  media,
  title,
  index,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const item = media[index];
  const hasMultipleItems = media.length > 1;

  const goPrevious = useCallback(() => {
    onIndexChange(index === 0 ? media.length - 1 : index - 1);
  }, [index, media.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange(index === media.length - 1 ? 0 : index + 1);
  }, [index, media.length, onIndexChange]);

  const requestClose = useCallback(() => {
    if (closeTimerRef.current !== null) return;

    setIsVisible(false);
    closeTimerRef.current = setTimeout(onClose, CLOSE_TRANSITION_MS);
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const { body, documentElement } = document;
    const originalOverflow = body.style.overflow;
    const originalPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(
        window.getComputedStyle(body).paddingRight,
      );
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      setIsVisible(true);
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
      body.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (hasMultipleItems && event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (hasMultipleItems && event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS) ??
          [],
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, hasMultipleItems, requestClose]);

  if (!item) return null;

  const itemLabel =
    item.alt ??
    item.title ??
    `${title} ${item.type === "video" ? "video" : "image"} ${index + 1}`;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery viewer`}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className={`fixed inset-0 z-[1000] bg-black/95 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={requestClose}
        aria-label={`Close ${title} gallery`}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white transition-colors hover:border-accent hover:bg-accent hover:text-button-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-5 sm:top-5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {hasMultipleItems && (
        <>
          <button
            type="button"
            onClick={goPrevious}
            aria-label={`Show previous ${title} item`}
            className="absolute bottom-4 left-4 z-20 flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white transition-colors hover:border-accent hover:bg-accent hover:text-button-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={`Show next ${title} item`}
            className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center border border-line-strong bg-paper/90 text-white transition-colors hover:border-accent hover:bg-accent hover:text-button-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="pointer-events-none absolute inset-x-4 bottom-20 top-16 flex items-center justify-center sm:inset-x-20 sm:bottom-10 sm:top-10">
        <div
          className={`pointer-events-auto relative h-full max-h-[86vh] w-full max-w-[1200px] transition-transform duration-200 ${
            isVisible ? "scale-100" : "scale-[0.98]"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          {item.type === "video" ? (
            <video
              key={item.src}
              src={item.src}
              poster={item.thumbnail}
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              aria-label={itemLabel}
              className="h-full w-full object-contain"
            />
          ) : (
            <LightboxImage key={item.src} src={item.src} alt={itemLabel} />
          )}
        </div>
      </div>

      <span
        aria-live="polite"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-muted sm:bottom-5"
      >
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(media.length).padStart(2, "0")}
      </span>
    </div>
  );
}
