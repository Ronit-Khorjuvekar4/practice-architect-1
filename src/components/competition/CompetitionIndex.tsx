"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type UIEvent,
} from "react";
import type { Competition } from "@/types/competition";
import { cn } from "@/lib/utils";

type CompetitionIndexProps = {
  items: Competition[];
  selectedId: string;
  onSelect: (competition: Competition) => void;
};

const ROW_HEIGHT = 76;
const OVERSCAN = 4;

const CompetitionRow = memo(function CompetitionRow({
  competition,
  index,
  isActive,
  onSelect,
  onKeyDown,
}: {
  competition: Competition;
  index: number;
  isActive: boolean;
  onSelect: (competition: Competition) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <li
      className="absolute inset-x-0"
      style={{ height: ROW_HEIGHT, transform: `translateY(${index * ROW_HEIGHT}px)` }}
    >
      <button
        type="button"
        data-competition-index={index}
        aria-current={isActive ? "true" : undefined}
        onClick={() => onSelect(competition)}
        onKeyDown={(event) => onKeyDown(index, event)}
        className={cn(
          "group grid h-full w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-4 text-left transition-colors sm:px-5",
          isActive
            ? "border-accent bg-accent text-button-text"
            : "bg-transparent text-white hover:bg-card",
        )}
      >
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.12em]",
            isActive ? "text-button-text/70" : "text-muted",
          )}
        >
          {String(index + 1).padStart(3, "0")}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-serif text-[17px] leading-tight">
            {competition.name}
          </span>
        </span>
      </button>
    </li>
  );
});

export function CompetitionIndex({
  items,
  selectedId,
  onSelect,
}: CompetitionIndexProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const pendingScrollTopRef = useRef(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(360);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportHeight(entry.contentRect.height);
    });
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN, 0);
    const end = Math.min(
      Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN,
      items.length,
    );
    return { startIndex: start, endIndex: end };
  }, [items.length, scrollTop, viewportHeight]);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * ROW_HEIGHT;

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    pendingScrollTopRef.current = event.currentTarget.scrollTop;

    if (scrollFrameRef.current === null) {
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        setScrollTop(pendingScrollTopRef.current);
        scrollFrameRef.current = null;
      });
    }
  };

  const handleRowKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
      let nextIndex = index;

      if (event.key === "ArrowDown") {
        nextIndex = Math.min(index + 1, items.length - 1);
      } else if (event.key === "ArrowUp") {
        nextIndex = Math.max(index - 1, 0);
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      onSelect(items[nextIndex]);
      viewportRef.current?.scrollTo({
        top: Math.max(
          0,
          nextIndex * ROW_HEIGHT - (viewportHeight - ROW_HEIGHT) / 2,
        ),
      });

      window.setTimeout(() => {
        viewportRef.current
          ?.querySelector<HTMLButtonElement>(
            `[data-competition-index="${nextIndex}"]`,
          )
          ?.focus();
      }, 0);
    },
    [items, onSelect, viewportHeight],
  );

  return (
    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border border-line-strong bg-panel">
      <div className="flex items-center justify-between border-b border-line-strong px-4 py-4 sm:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          All Competitions
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
          {String(items.length).padStart(3, "0")} loaded
        </span>
      </div>

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        aria-label="All Competitions"
        className="h-[320px] min-h-0 touch-pan-y touch-pinch-zoom overflow-y-auto lg:h-auto lg:overscroll-contain"
      >
        <ul className="relative" style={{ height: totalHeight }}>
          {visibleItems.map((competition, offset) => {
            const index = startIndex + offset;
            return (
              <CompetitionRow
                key={competition.id}
                competition={competition}
                index={index}
                isActive={competition.id === selectedId}
                onSelect={onSelect}
                onKeyDown={handleRowKeyDown}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
