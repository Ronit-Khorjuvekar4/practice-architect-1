import type { Project, ProjectMedia } from "@/types/project";
import type {
  StrapiMedia,
  StrapiMediaField,
  StrapiProjectMediaComponent,
} from "@/types/strapi";
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
 * Resolves a single still image for project cards and metadata. Prefers the
 * dedicated cover, then gallery media, and finally a shipped placeholder so
 * callers always receive a valid `next/image` source without merging the
 * cover into the gallery.
 */
export function getProjectCover(project: Project): string {
  if (project.coverImage?.src) {
    return project.coverImage.src;
  }

  const firstImage = project.project_media.find(isImageMedia);
  if (firstImage) {
    return firstImage.src;
  }

  const posterVideo = project.project_media.find(
    (media) => media.type === "video" && media.thumbnail,
  );
  if (posterVideo?.thumbnail) {
    return posterVideo.thumbnail;
  }

  return MEDIA_PLACEHOLDER;
}

/* ── Strapi → frontend media normalization ─────────────────────────────── */

/**
 * Unwraps both supported Strapi media shapes:
 * - v5: `media.url`
 * - v4: `media.data.attributes.url`
 */
export function unwrapStrapiMedia(
  media: StrapiMediaField | undefined,
): StrapiMedia | null {
  if (!media) return null;

  if ("url" in media) {
    return typeof media.url === "string" && media.url ? media : null;
  }

  const attributes = media.data?.attributes;
  return attributes?.url ? attributes : null;
}

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
  item: StrapiProjectMediaComponent | null | undefined,
): ProjectMedia | null {
  if (!item) {
    return null;
  }

  const file = unwrapStrapiMedia(item.src);
  if (!file) {
    return null;
  }

  // Trust the component's explicit `type`; otherwise infer from the mime.
  const type: ProjectMedia["type"] =
    item.type ?? (file.mime?.startsWith("video/") ? "video" : "image");

  const thumbnailUrl = unwrapStrapiMedia(item.src_thumbnail)?.url ?? null;

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
  cover: StrapiMediaField | undefined,
): ProjectMedia | null {
  const file = unwrapStrapiMedia(cover);
  if (!file) {
    return null;
  }

  return {
    type: "image",
    src: getStrapiMediaUrl(file.url),
    alt: file.alternativeText ?? undefined,
  };
}
