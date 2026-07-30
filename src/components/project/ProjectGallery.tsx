"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/types/project";
import type {
  StrapiCollectionResponse,
  StrapiProjectMediaComponent,
} from "@/types/strapi";
import { GALLERY_PAGE_SIZE, isVideoMedia, normalizeStrapiMedia } from "@/lib/media";
import { STRAPI_API_URL, buildStrapiQuery } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { ProjectLightbox } from "@/components/project/ProjectLightbox";
import { ProjectVideoPreview } from "@/components/project/ProjectVideoPreview";

type ProjectGalleryProps = {
  /** First page (25) of media, rendered on the server — no client request. */
  initialMedia: ProjectMedia[];
  /** Total media count from Strapi, used to derive how many pages exist. */
  total: number;
  /** Strapi documentId of the project, used to fetch further gallery pages. */
  documentId: string;
  title: string;
};

/**
 * Matches the responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop.
 * Tells Next.js which source resolution to fetch for each square cell.
 */
const GALLERY_SIZES =
  "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";

type LoadStatus = "idle" | "loading" | "error";

/**
 * Incremental gallery. The first 25 items arrive server-rendered; each
 * "View More" click fetches the next 25 from the project's `gallery` endpoint
 * (server-side Strapi pagination) and appends them. Reset across projects is
 * handled by the parent passing `key={documentId}`, so state re-initialises
 * from props on navigation.
 */
export function ProjectGallery({
  initialMedia,
  total,
  documentId,
  title,
}: ProjectGalleryProps) {
  const [media, setMedia] = useState<ProjectMedia[]>(initialMedia);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(() =>
    total > 0 ? Math.ceil(total / GALLERY_PAGE_SIZE) : 1,
  );
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasMore = Boolean(documentId) && page < pageCount;

  const loadMore = useCallback(async () => {
    if (status === "loading" || !documentId || page >= pageCount) return;

    const nextPage = page + 1;
    setStatus("loading");
    try {
      const query = buildStrapiQuery({
        pagination: { page: nextPage, pageSize: GALLERY_PAGE_SIZE },
      });
      const res = await fetch(
        `${STRAPI_API_URL}/projects/${documentId}/gallery${query}`,
      );
      if (!res.ok) {
        throw new Error(`Gallery request failed with status ${res.status}`);
      }

      const json =
        (await res.json()) as StrapiCollectionResponse<StrapiProjectMediaComponent>;
      const incoming = (json.data ?? [])
        .map(normalizeStrapiMedia)
        .filter((item): item is ProjectMedia => item !== null);

      setMedia((prev) => {
        // De-dupe by src so a retry or overlap never renders the same file twice.
        const seen = new Set(prev.map((item) => item.src));
        return [...prev, ...incoming.filter((item) => !seen.has(item.src))];
      });
      setPage(json.meta.pagination?.page ?? nextPage);
      if (json.meta.pagination?.pageCount) {
        setPageCount(json.meta.pagination.pageCount);
      }
      setStatus("idle");
    } catch (error) {
      // Keep already-loaded items visible; surface a retry via the button.
      console.error("Failed to load more gallery media:", error);
      setStatus("error");
    }
  }, [status, documentId, page, pageCount]);

  if (media.length === 0) {
    return null;
  }

  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <>
      <ul
        role="list"
        aria-label="Project gallery"
        className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {media.map((item, i) => {
          const isVideo = isVideoMedia(item);
          const isEager = i < 3;

          return (
            <li
              key={item.src}
              className="min-w-0"
              // Skip layout/paint for offscreen cards; the estimate keeps the
              // scroll height stable so nothing jumps as cards render.
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "auto 400px",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Open ${title} ${
                  isVideo ? "video" : "image"
                } ${i + 1} of ${media.length}`}
                style={{ backgroundColor: "var(--surface-strong)" }}
                className="group relative block aspect-square w-full cursor-pointer overflow-hidden p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                {isVideo ? (
                  <ProjectVideoPreview
                    media={item}
                    title={title}
                    index={i}
                    sizes={GALLERY_SIZES}
                    priority={isEager}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt ?? `${title} — image ${i + 1}`}
                    fill
                    quality={85}
                    loading={isEager ? "eager" : "lazy"}
                    priority={isEager}
                    sizes={GALLERY_SIZES}
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    className="transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                  />
                )}

                {/* Hover darken overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] bg-black/0 transition-colors duration-200 group-hover:bg-black/30"
                />

                {/* Index badge — top-right */}
                <span
                  aria-hidden="true"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  className="absolute right-2 top-2 z-[2] px-1.5 py-[3px] text-[10px] leading-none tracking-[0.08em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadMore}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={
              isError ? "Retry loading more gallery media" : "View more gallery media"
            }
          >
            {isLoading ? "Loading…" : isError ? "Retry" : "View More"}
          </Button>
          {isError && (
            <p role="alert" className="text-[13px] text-copy">
              Couldn’t load more media. Please try again.
            </p>
          )}
        </div>
      )}

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
