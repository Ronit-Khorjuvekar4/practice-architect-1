"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 300;
const RING_RADIUS = 25;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type ScrollState = {
  progress: number;
  visible: boolean;
};

export function BackToTopButton() {
  const [{ progress, visible }, setScrollState] = useState<ScrollState>({
    progress: 0,
    visible: false,
  });

  useEffect(() => {
    let animationFrameId = 0;

    const updateScrollState = () => {
      const { documentElement } = document;
      const scrollTop =
        window.scrollY || documentElement.scrollTop || document.body.scrollTop;
      const maxScroll = Math.max(
        documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const nextProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

      setScrollState({
        progress: nextProgress,
        visible: scrollTop > SHOW_AFTER_PX,
      });
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 text-white shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-300 ease-out md:bottom-8 md:right-8 md:h-14 md:w-14 ${
        visible
          ? "translate-y-0 opacity-100 hover:-translate-y-1 hover:border-[#9a7b4f] hover:bg-[#9a7b4f] hover:text-paper hover:shadow-[0_18px_42px_rgba(154,123,79,0.22)]"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 56 56"
      >
        <circle
          cx="28"
          cy="28"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
        />
        <circle
          cx="28"
          cy="28"
          r={RING_RADIUS}
          fill="none"
          stroke="#9a7b4f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>

      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
