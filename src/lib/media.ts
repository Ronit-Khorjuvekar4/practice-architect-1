import type { Project, ProjectMedia } from "@/types/project";
import type { StrapiMedia, StrapiProjectMediaComponent } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

type ImageProjectMedia = ProjectMedia & { type: "image" };
type VideoProjectMedia = ProjectMedia & { type: "video" };

/** Local placeholder used when a project has no usable image at all. */
export const MEDIA_PLACEHOLDER = "/placeholder/01.svg";

/** Narrows a media item to an image. */
export function isImageMedia(media: ProjectMedia): media is ImageProjectMedia {
  return media.type === "image";
}

/** Narrows a media item to a video. */
export function isVideoMedia(media: ProjectMedia): media is VideoProjectMedia {
  return media.type === "video";
}

/**
 * Resolves a single still image for use in cards and thumbnail strips,
 * where a `<video>` element is not appropriate. Prefers the first image,
 * then any video poster, and finally a shipped placeholder so callers
 * always receive a valid `next/image` source.
 */
export function getProjectCover(project: Project): string {
  const firstImage = project.media.find(isImageMedia);
  if (firstImage) {
    return firstImage.src;
  }

  const posterVideo = project.media.find(
    (media) => media.type === "video" && media.thumbnail,
  );
  if (posterVideo?.thumbnail) {
    return posterVideo.thumbnail;
  }

  return MEDIA_PLACEHOLDER;
}

/* ── Strapi → frontend media normalization ─────────────────────────────── */

/**
 * Normalizes one `project_media` repeatable-component item into the frontend
 * `ProjectMedia` shape. Returns `null` when the item has no uploaded file
 * (nothing renderable).
 *
 * - Images resolve to a URL safe for `next/image`.
 * - Videos resolve to a URL safe for a plain `<video>` tag.
 * - Relative `/uploads/*` URLs become absolute; absolute URLs pass through.
 */
export function normalizeStrapiMedia(
  item: StrapiProjectMediaComponent,
): ProjectMedia | null {
  const file = item.src ?? null;
  if (!file?.url) {
    return null;
  }

  // Trust the component's explicit `type`; otherwise infer from the mime.
  const type: ProjectMedia["type"] =
    item.type ?? (file.mime?.startsWith("video/") ? "video" : "image");

  const thumbnailUrl = item.src_thumbnail?.url ?? null;

  return {
    type,
    src: getStrapiMediaUrl(file.url),
    alt: item.alt ?? file.alternativeText ?? undefined,
    title: item.title ?? undefined,
    thumbnail: thumbnailUrl ? getStrapiMediaUrl(thumbnailUrl) : undefined,
  };
}

/**
 * Normalizes a single `coverImage` media field into an image `ProjectMedia`.
 * Returns `null` when no cover image is set.
 */
export function normalizeCoverImage(
  cover: StrapiMedia | null | undefined,
): ProjectMedia | null {
  if (!cover?.url) {
    return null;
  }

  return {
    type: "image",
    src: getStrapiMediaUrl(cover.url),
    alt: cover.alternativeText ?? undefined,
  };
}
