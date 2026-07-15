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
import type { CompetitionSummary } from "@/types/competition";
import { cn } from "@/lib/utils";

type CompetitionIndexProps = {
  items: CompetitionSummary[];
  selectedId: string;
  hasNextPage: boolean;
  isLoadingNextPage: boolean;
  loadError: string | null;
  onSelect: (competition: CompetitionSummary) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

const ROW_HEIGHT = 76;
const STATUS_HEIGHT = 52;
const OVERSCAN = 4;

const CompetitionRow = memo(function CompetitionRow({
  competition,
  index,
  isActive,
  onSelect,
  onKeyDown,
}: {
  competition: CompetitionSummary;
  index: number;
  isActive: boolean;
  onSelect: (competition: CompetitionSummary) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  return (
    <li
      className="absolute inset-x-0"
      style={{ height: ROW_HEIGHT, transform: `translateY(${index * ROW_HEIGHT}px)` }}
        onClick={() => onSelect(competition)}
    >
      <button
        type="button"
        data-competition-index={index}
        aria-current={isActive ? "true" : undefined}
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
            {competition.title}
          </span>
        </span>
      </button>
    </li>
  );
});

export function CompetitionIndex({
  items,
  selectedId,
  hasNextPage,
  isLoadingNextPage,
  loadError,
  onSelect,
  onLoadMore,
  onRetry,
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
  const hasStatusRow = hasNextPage || Boolean(loadError);
  const totalHeight =
    items.length * ROW_HEIGHT + (hasStatusRow ? STATUS_HEIGHT : 0);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    pendingScrollTopRef.current = viewport.scrollTop;

    if (scrollFrameRef.current === null) {
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        setScrollTop(pendingScrollTopRef.current);
        scrollFrameRef.current = null;
      });
    }

    const remaining =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    if (hasNextPage && remaining < ROW_HEIGHT * 5) {
      onLoadMore();
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
          Competition index
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
          {String(items.length).padStart(3, "0")} loaded
        </span>
      </div>

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        aria-label="Competition index"
        aria-busy={isLoadingNextPage}
        className="h-[320px] min-h-0 overflow-y-auto overscroll-contain lg:h-auto"
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

          {hasStatusRow && (
            <li
              className="absolute inset-x-0 flex items-center justify-center px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
              style={{
                height: STATUS_HEIGHT,
                transform: `translateY(${items.length * ROW_HEIGHT}px)`,
              }}
            >
              {loadError ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="underline underline-offset-4"
                >
                  Could not load more — retry
                </button>
              ) : isLoadingNextPage ? (
                "Loading more competitions…"
              ) : (
                "Scroll for more"
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
