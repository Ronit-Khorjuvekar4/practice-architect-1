import type {
  CategorySlug,
  Project,
  ProjectSeo,
  ProjectStatus,
} from "@/types/project";
import type {
  StrapiCollectionResponse,
  StrapiProject,
  StrapiSeo,
} from "@/types/strapi";
import {
  fetchStrapiData,
  getStrapiMediaUrl,
  logStrapiError,
  type StrapiQuery,
} from "@/lib/strapi";
import { normalizeCoverImage, normalizeStrapiMedia } from "@/lib/media";

/**
 * ── Strapi `project` schema (verified against the live API) ─────────────
 *
 * Collection `project` (API ID plural: `projects`)
 *   - title            Text
 *   - slug             UID
 *   - year             Text             → mapped to Project.dateOfCompletion
 *   - project_status   Enumeration      (e.g. "completed", "in progress")
 *   - practice_category Relation        → practice-category
 *   - coverImage       Media (single)
 *   - project_media    Repeatable component:
 *       { type: enum, title, alt, src: Media, src_thumbnail: Media }
 *
 * The frontend `Project` type also carries `shortDescription`, `description`,
 * `location`, `area`, `projectType` and `seo`. These do NOT yet exist on the
 * Strapi content type — the normalizer defaults them gracefully. When you add
 * them in Strapi they flow through automatically (this file fetches all
 * scalar fields; see `listingQuery`). For `seo`, also un-comment the populate
 * line in `DETAIL_POPULATE`.
 *
 * IMPORTANT:
 *   - Strapi's public role (or the API token) must allow `find` + `findOne`
 *     on `project` and `practice-category`.
 *   - Requesting `fields`/`populate` for an attribute that does NOT exist
 *     makes Strapi return HTTP 400. Only reference fields that exist.
 * ────────────────────────────────────────────────────────────────────────
 */
const PROJECTS_ENDPOINT = "/projects";

/**
 * Lean populate for listings. No `fields` filter on the project itself —
 * Strapi returns every scalar by default, so newly-added fields (location,
 * shortDescription, …) appear with no code change here.
 */
const LIST_POPULATE = {
  practice_category: { fields: ["title", "slug"] },
  coverImage: { fields: ["url", "alternativeText", "width", "height"] },
};

/** Full populate for a single project detail page. */
const DETAIL_POPULATE = {
  practice_category: { fields: ["title", "slug", "description"] },
  coverImage: true,
  project_media: { populate: { src: true, src_thumbnail: true } },
  // Add once a `seo` component exists on the Project type:
  // seo: { populate: { metaImage: true } },
};

/* ── Normalizers ───────────────────────────────────────────────────────── */

/** Maps a Strapi `project_status` value onto the frontend status union. */
function normalizeStatus(value: StrapiProject["project_status"]): ProjectStatus {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("progress") || text.includes("ongoing")) {
    return "In Progress";
  }
  // "completed", unknown values, and empties all settle on "Completed".
  return "Completed";
}

/** Maps a Strapi `shared.seo` component onto the frontend `ProjectSeo`. */
function normalizeSeo(
  seo: StrapiSeo | null | undefined,
): ProjectSeo | undefined {
  if (!seo) return undefined;
  return {
    title: seo.metaTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
    canonicalUrl: seo.canonicalURL ?? undefined,
    ogImage: seo.metaImage?.url
      ? getStrapiMediaUrl(seo.metaImage.url)
      : undefined,
  };
}

/**
 * Maps a raw Strapi project onto the frontend `Project`. Tolerates partial
 * data: a listing query (no `project_media`) yields `media` containing just
 * the cover; a detail query yields cover + full gallery.
 */
export function normalizeProject(entry: StrapiProject): Project {
  const category = entry.practice_category ?? null;

  const cover = normalizeCoverImage(entry.coverImage);
  const gallery = (entry.project_media ?? [])
    .map(normalizeStrapiMedia)
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Cover leads the gallery so `getProjectCover` and the hero pick it first.
  const media = cover ? [cover, ...gallery] : gallery;

  return {
    documentId: entry.documentId,
    title: entry.title,
    slug: entry.slug,
    // The slug is validated against the route in the page component.
    category: (category?.slug ?? "architecture") as CategorySlug,
    categoryLabel: category?.label ?? category?.title ?? undefined,
    shortDescription: entry.shortDescription ?? "",
    description: entry.description ?? "",
    location: entry.location ?? "",
    area: entry.area ?? "",
    dateOfCompletion: entry.year != null ? String(entry.year) : "",
    status: normalizeStatus(entry.project_status),
    projectType: entry.projectType ?? undefined,
    media,
    seo: normalizeSeo(entry.seo),
  };
}

/* ── Shared query helper ───────────────────────────────────────────────── */

/** Builds a listing query, optionally merging extra filters. */
function listingQuery(extra: StrapiQuery = {}): StrapiQuery {
  return {
    populate: LIST_POPULATE,
    sort: ["year:desc"],
    pagination: { pageSize: 100 },
    ...extra,
  };
}

/* ── Data functions ────────────────────────────────────────────────────── */

/** Every project, newest first. Returns `[]` if Strapi is unreachable. */
export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiProject>>(
      PROJECTS_ENDPOINT,
      { query: listingQuery(), tags: ["projects"] },
    );
    return res.data.map(normalizeProject);
  } catch (error) {
    logStrapiError("getProjects", error);
    return [];
  }
}

/** Projects belonging to a category, by category slug. */
export async function getProjectsByCategory(
  categorySlug: string,
): Promise<Project[]> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiProject>>(
      PROJECTS_ENDPOINT,
      {
        query: listingQuery({
          filters: { practice_category: { slug: { $eq: categorySlug } } },
        }),
        tags: ["projects", `category:${categorySlug}`],
      },
    );
    return res.data.map(normalizeProject);
  } catch (error) {
    logStrapiError(`getProjectsByCategory(${categorySlug})`, error);
    return [];
  }
}

/** A single fully-populated project by slug, or `null` if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiProject>>(
      PROJECTS_ENDPOINT,
      {
        query: {
          filters: { slug: { $eq: slug } },
          populate: DETAIL_POPULATE,
          pagination: { pageSize: 1 },
        },
        tags: ["projects", `project:${slug}`],
      },
    );
    const entry = res.data[0];
    return entry ? normalizeProject(entry) : null;
  } catch (error) {
    logStrapiError(`getProjectBySlug(${slug})`, error);
    return null;
  }
}

/**
 * `{ category, slug }` pairs for every project — feeds `generateStaticParams`
 * on `/[category]/[slug]`. Returns `[]` on failure so the build never breaks;
 * unknown routes then render on-demand (ISR) instead of being pre-rendered.
 */
export async function getProjectSlugs(): Promise<
  { category: string; slug: string }[]
> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiProject>>(
      PROJECTS_ENDPOINT,
      {
        query: {
          fields: ["slug"],
          populate: { practice_category: { fields: ["slug"] } },
          pagination: { pageSize: 200 },
        },
        tags: ["projects"],
      },
    );
    return res.data
      .filter((p) => Boolean(p.slug) && Boolean(p.practice_category?.slug))
      .map((p) => ({
        category: p.practice_category!.slug,
        slug: p.slug,
      }));
  } catch (error) {
    logStrapiError("getProjectSlugs", error);
    return [];
  }
}
