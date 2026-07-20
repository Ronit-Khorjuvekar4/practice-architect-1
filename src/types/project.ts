/**
 * Shared domain types for Practice Architects.
 *
 * These are the *frontend-friendly* types every UI component consumes.
 * Raw Strapi shapes live in `types/strapi.ts`; the `lib/*` data functions
 * normalize Strapi responses into the types below, so components never need
 * to know the data came from a CMS.
 */

export type CategorySlug =
  | "architecture"
  | "interior"
  | "planning"
  | "landscape";

export type ProjectStatus = "Completed" | "In Progress";

export type Category = {
  slug: CategorySlug;
  label: string;
  title: string;
  description: string;
  img: string;
};

/** A single gallery item — either a still image or a video clip. */
export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
  title?: string;
  /** Poster frame for videos; also used as a still preview in cards/strips. */
  thumbnail?: string;
};

/** SEO fields, sourced from a Strapi `shared.seo` component when present. */
export type ProjectSeo = {
  title?: string;
  description?: string;
  /** Absolute URL of the Open Graph image. */
  ogImage?: string;
  canonicalUrl?: string;
};

export type Project = {
  title: string;
  slug: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  location: string;
  area: string;
  dateOfCompletion: string;
  status: ProjectStatus;
  /** Featured image used by project cards, metadata, and hero treatments. */
  coverImage: ProjectMedia | null;
  /** Gallery media from Strapi's `project_media` repeatable component only. */
  project_media: ProjectMedia[];
  /** Strapi v5 stable identifier — handy for cache tags and previews. */
  documentId?: string;
  /** Human-readable category name, denormalized so cards need no lookup. */
  categoryLabel?: string;
  /** Optional project typology, e.g. "Residential", "Cultural". */
  projectType?: string;
  /** Optional SEO metadata for the detail page. */
  seo?: ProjectSeo;
};
