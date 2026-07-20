import type { Category, CategorySlug } from "@/types/project";
import type {
  StrapiCategory,
  StrapiCollectionResponse,
} from "@/types/strapi";
import { fetchStrapiData, getStrapiMediaUrl, logStrapiError } from "@/lib/strapi";
import { unwrapStrapiMedia } from "@/lib/media";

/**
 * Categories are a Strapi collection (`practice-category`). The four
 * disciplines are also *structural* — their slugs are route paths — so if
 * Strapi is unreachable we degrade to the defaults below rather than render
 * a site with no navigation. The fallback is always logged, never silent.
 *
 * Strapi `practice-category` schema (verified — API ID plural `practice-categories`):
 *   - title        Text
 *   - slug         UID
 *   - description  Text
 *
 * `label` and `image` do NOT exist on the content type yet, so they are not
 * requested here (Strapi returns HTTP 400 for unknown fields). `normalizeCategory`
 * fills `label` from `title` and `img` from the static defaults below. If you
 * add a `label` text field / `image` media field in Strapi, also re-add them
 * to the queries.
 */
const PRACTICE_CATEGORIES_ENDPOINT = "/practice-categories";

/**
 * Presentation defaults. Used (a) as a fallback when Strapi is down, and
 * (b) to fill in `label` / `img` / `description` for any field a category
 * entry leaves blank in Strapi.
 */
const CATEGORY_DEFAULTS: Record<CategorySlug, Category> = {
  architecture: {
    slug: "architecture",
    label: "Architecture",
    title: "Architecture Portfolio",
    description:
      "Built and unbuilt architectural work across residential, civic and cultural typologies — from small interventions to masterplanned districts.",
    img:"/home/Architeture.jpg"
  },
  interior: {
    slug: "interior",
    label: "Interior",
    title: "Interior Portfolio",
    description:
      "Interior commissions spanning hospitality, retail and residential — material-led, atmosphere-first, never decorative.",
    img:"/home/Interiour.jpg"
  },
  planning: {
    slug: "planning",
    label: "Planning",
    title: "Planning Portfolio",
    description:
      "Urban planning, masterplanning and feasibility studies — neighbourhood-scale work that knits architecture to its city.",
    img:"/home/planningg.png" 
  },
  landscape: {
    slug: "landscape",
    label: "Landscape",
    title: "Landscape Portfolio",
    description:
      "Landscape, garden and public-realm design — sites read first as terrain, then as plan.",
    img:"/home/landscape.jpg"
  },
};

/**
 * Listing query. No `fields` filter — Strapi returns every scalar by default,
 * so a `label` field added later flows through with no code change.
 */
const CATEGORY_QUERY = {
  sort: ["title:asc"],
  pagination: { pageSize: 50 },
} as const;

/** Maps a raw Strapi category onto the frontend `Category`, filling gaps. */
function normalizeCategory(entry: StrapiCategory): Category {
  const slug = entry.slug as CategorySlug;
  const fallback = CATEGORY_DEFAULTS[slug];
  const image = unwrapStrapiMedia(entry.image);

  return {
    slug,
    label: entry.label ?? entry.title ?? fallback?.label ?? slug,
    title: entry.title ?? fallback?.title ?? slug,
    description: entry.description ?? fallback?.description ?? "",
    img: image?.url
      ? getStrapiMediaUrl(image.url)
      : (fallback?.img ?? "/placeholder/01.svg"),
  };
}

/**
 * All practice categories, ordered for navigation and listing.
 * On a Strapi connection failure, returns the structural defaults.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiCategory>>(
      PRACTICE_CATEGORIES_ENDPOINT,
      { query: { ...CATEGORY_QUERY }, tags: ["categories"] },
    );
    return res.data.map(normalizeCategory);
  } catch (error) {
    logStrapiError("getCategories", error);
    return Object.values(CATEGORY_DEFAULTS);
  }
}

/** A single category by route slug, or `null` if no such category exists. */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiCategory>>(
      PRACTICE_CATEGORIES_ENDPOINT,
      {
        query: {
          filters: { slug: { $eq: slug } },
          pagination: { pageSize: 1 },
        },
        tags: ["categories", `category:${slug}`],
      },
    );
    const entry = res.data[0];
    return entry ? normalizeCategory(entry) : null;
  } catch (error) {
    logStrapiError(`getCategoryBySlug(${slug})`, error);
    // Reachability failure — degrade to a known discipline if the slug is one.
    return CATEGORY_DEFAULTS[slug as CategorySlug] ?? null;
  }
}

/**
 * All category slugs — feeds `generateStaticParams` for `/[category]`.
 * Falls back to the four known route slugs if Strapi is unreachable, so the
 * build never fails and the structural routes are always pre-rendered.
 */
export async function getCategorySlugs(): Promise<string[]> {
  try {
    const res = await fetchStrapiData<StrapiCollectionResponse<StrapiCategory>>(
      PRACTICE_CATEGORIES_ENDPOINT,
      {
        query: { fields: ["slug"], pagination: { pageSize: 50 } },
        tags: ["categories"],
      },
    );
    const slugs = res.data.map((c) => c.slug).filter(Boolean);
    return slugs.length > 0 ? slugs : Object.keys(CATEGORY_DEFAULTS);
  } catch (error) {
    logStrapiError("getCategorySlugs", error);
    return Object.keys(CATEGORY_DEFAULTS);
  }
}
