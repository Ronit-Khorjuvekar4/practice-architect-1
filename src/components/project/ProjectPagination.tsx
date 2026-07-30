"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProjectsPagination } from "@/lib/projects";

type ProjectPaginationProps = {
  pagination: ProjectsPagination;
  /** Route these controls point at, e.g. "/architecture". */
  basePath: string;
  /** Existing query params to preserve when changing the page (minus `page`). */
  baseParams?: Record<string, string>;
};

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

/**
 * First page, last page, and a sibling window around the current page, with
 * an ellipsis where pages are skipped (MUI-style). Matches the reference:
 *   page 2   → 1 2 3 4 5 … 252
 *   page 50  → 1 … 49 50 51 … 252
 *   page 252 → 1 … 248 249 250 251 252
 */
function paginationRange(page: number, pageCount: number): (number | "…")[] {
  const boundaryCount = 1;
  const siblingCount = 1;

  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(
    Math.max(pageCount - boundaryCount + 1, boundaryCount + 1),
    pageCount,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (["…"] as const)
      : boundaryCount + 1 < pageCount - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pageCount - boundaryCount - 1
      ? (["…"] as const)
      : pageCount - boundaryCount > boundaryCount
        ? [pageCount - boundaryCount]
        : []),
    ...endPages,
  ];
}

const itemBase =
  "inline-flex h-9 min-w-9 items-center justify-center px-3 text-[13px] transition-colors";
const navBtnBase =
  "inline-flex h-9 items-center gap-2 border px-3.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors";

export function ProjectPagination({
  pagination,
  basePath,
  baseParams = {},
}: ProjectPaginationProps) {
  const { page, pageCount } = pagination;
  const router = useRouter();
  const [inputValue, setInputValue] = useState(String(page));

  // Keep the input in sync when navigation lands on a new page.
  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  if (pageCount <= 1) return null;

  const hrefForPage = (target: number): string => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(target));
    return `${basePath}?${params.toString()}`;
  };

  const goToInput = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(inputValue);
    if (!Number.isInteger(parsed)) return;
    const target = Math.min(Math.max(parsed, 1), pageCount);
    router.push(hrefForPage(target));
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;
  const items = paginationRange(page, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 border-t border-line pt-8"
    >
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
        Page {page} of {pageCount} • Projects
      </p>

      <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
        <form
          onSubmit={goToInput}
          className="flex items-center gap-2 md:justify-self-start"
        >
          <label
            htmlFor="pagination-goto"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-micro"
          >
            Go to
          </label>
          <input
            id="pagination-goto"
            type="number"
            min={1}
            max={pageCount}
            inputMode="numeric"
            aria-label={`Go to page (1 to ${pageCount})`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-16 border border-line bg-transparent px-2 py-1.5 text-center text-[13px] text-white outline-none focus:border-accent"
          />
        </form>

        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          <li>
            {prevDisabled ? (
              <span
                aria-disabled="true"
                className={`${navBtnBase} cursor-not-allowed border-line text-micro opacity-50`}
              >
                <span aria-hidden="true">←</span> Prev
              </span>
            ) : (
              <Link
                href={hrefForPage(page - 1)}
                rel="prev"
                aria-label="Go to previous page"
                className={`${navBtnBase} border-line text-white hover:border-accent`}
              >
                <span aria-hidden="true">←</span> Prev
              </Link>
            )}
          </li>

          {items.map((item, index) => {
            if (item === "…") {
              return (
                <li key={`ellipsis-${index}`} aria-hidden="true">
                  <span className={`${itemBase} text-micro`}>…</span>
                </li>
              );
            }

            const isActive = item === page;
            // On the smallest screens, keep only the boundaries and the pages
            // adjacent to the current one — the rest collapse to reduce clutter.
            const isCore =
              item === 1 ||
              item === pageCount ||
              Math.abs(item - page) <= 1;

            return (
              <li
                key={item}
                className={isCore ? undefined : "hidden sm:block"}
              >
                {isActive ? (
                  <span
                    aria-current="page"
                    className={`${itemBase} rounded-md border border-line-strong bg-card font-medium text-white`}
                  >
                    {item}
                  </span>
                ) : (
                  <Link
                    href={hrefForPage(item)}
                    aria-label={`Go to page ${item}`}
                    className={`${itemBase} rounded-md text-copy hover:text-white`}
                  >
                    {item}
                  </Link>
                )}
              </li>
            );
          })}

          <li>
            {nextDisabled ? (
              <span
                aria-disabled="true"
                className={`${navBtnBase} cursor-not-allowed border-line text-micro opacity-50`}
              >
                Next <span aria-hidden="true">→</span>
              </span>
            ) : (
              <Link
                href={hrefForPage(page + 1)}
                rel="next"
                aria-label="Go to next page"
                className={`${navBtnBase} border-line text-white hover:border-accent`}
              >
                Next <span aria-hidden="true">→</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
