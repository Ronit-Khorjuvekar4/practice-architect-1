/**
 * Shared domain types for Practice Architects.
 *
 * `Category` is defined here (rather than in `lib/categories.ts`) so that
 * every type lives in one place and can be imported across the app.
 */

export type CategorySlug = "architecture" | "interior" | "planning" | "landscape";

export type ProjectStatus = "Completed" | "In Progress";

export type Category = {
  slug: CategorySlug;
  label: string;
  title: string;
  description: string;
  img:string
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

export type Project = {
  title: string;
  slug: string;
  category: CategorySlug;
  // shortDescription: string;
  // description: string;
  location: string;
  area: string;
  dateOfCompletion: string;
  status: ProjectStatus;
  media: ProjectMedia[];
};
