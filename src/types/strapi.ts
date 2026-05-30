/**
 * Raw Strapi v5 response types.
 *
 * These describe data exactly as the Strapi REST API returns it — they are
 * NOT used by UI components. `lib/projects.ts` and `lib/categories.ts`
 * normalize these into the frontend-friendly `Project` / `Category` types
 * in `types/project.ts`.
 *
 * Strapi v5 note: entries are flattened — there is no `data.attributes`
 * wrapper (that was Strapi v4). Relations and media, once populated, appear
 * directly on the entry.
 */

/** Generic Strapi v5 response for a single entry (e.g. /api/projects/:id). */
export interface StrapiResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

/** Generic Strapi v5 response for a collection (e.g. /api/projects). */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** One resized variant ("thumbnail", "small", "medium", "large") of an image. */
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  mime: string;
}

/** A Strapi media (upload) entry — an image or a video file. */
export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  /** e.g. "image/jpeg", "video/mp4" — used to tell images from videos. */
  mime: string;
  /** Present on images only; videos have no resized formats. */
  formats: Record<string, StrapiImageFormat> | null;
}

/**
 * One item of the repeatable `project_media` component.
 * Verified component fields: `type`, `title`, `alt`, `src`, `src_thumbnail`.
 */
export interface StrapiProjectMediaComponent {
  id: number;
  /** Explicit media kind; inferred from the file's mime type when absent. */
  type?: "image" | "video" | null;
  title?: string | null;
  alt?: string | null;
  /** The uploaded image or video file (component field name: `src`). */
  src?: StrapiMedia | null;
  /** Optional poster image for video items (component field: `src_thumbnail`). */
  src_thumbnail?: StrapiMedia | null;
}

/** Strapi's standard shared SEO component (`shared.seo`). */
export interface StrapiSeo {
  id: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalURL?: string | null;
  metaImage?: StrapiMedia | null;
}

/** A `practice-category` collection entry. */
export interface StrapiCategory {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  label?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
}

/** A `project` collection entry (Strapi v5, flattened). */
export interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  year?: string | number | null;
  description?: string | null;
  shortDescription?: string | null;
  /** Enumeration value, e.g. "Completed" / "In Progress". */
  project_status?: string | null;
  projectType?: string | null;
  location?: string | null;
  area?: string | null;
  /** Relation → practice-category (populated). */
  practice_category?: StrapiCategory | null;
  /** Repeatable component (populated). */
  project_media?: StrapiProjectMediaComponent[] | null;
  /** Single media field (populated). */
  coverImage?: StrapiMedia | null;
  /** Optional shared.seo component (populated). */
  seo?: StrapiSeo | null;
}
