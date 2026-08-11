import type { CategorySlug } from "@/types/project";
import type { OtherProject } from "@/types/other-project";
import type {
  StrapiCollectionResponse,
  StrapiOtherProject,
} from "@/types/strapi";
import { fetchStrapiData, logStrapiError } from "@/lib/strapi";

const OTHER_PROJECTS_ENDPOINT = "/other-projects";
const OTHER_PROJECTS_PAGE_SIZE = 100;
const CATEGORY_SLUGS: CategorySlug[] = [
  "architecture",
  "interior",
  "planning",
  "landscape",
];

const OTHER_PROJECTS_QUERY = {
  fields: ["name", "slug"],
  populate: {
    practice_category: { fields: ["title", "slug"] },
  },
  // There is no custom order field on this collection. Created order keeps
  // the CMS sequence deterministic and is straightforward to change later.
  sort: ["createdAt:asc"],
} as const;

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}

/** Prefer the stable category slug, falling back to a normalized title. */
function categorySlugFor(entry: StrapiOtherProject): CategorySlug | null {
  const relation = entry.practice_category;
  const candidate = (relation?.slug || relation?.title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return isCategorySlug(candidate) ? candidate : null;
}

function normalizeOtherProject(
  entry: StrapiOtherProject,
): OtherProject | null {
  const category = categorySlugFor(entry);
  const name = entry.name?.trim();

  if (!category || !name) return null;

  return {
    documentId: entry.documentId,
    name,
    slug: entry.slug,
    category,
  };
}

async function fetchPage(categorySlug: string, page: number) {
  return fetchStrapiData<StrapiCollectionResponse<StrapiOtherProject>>(
    OTHER_PROJECTS_ENDPOINT,
    {
      query: {
        ...OTHER_PROJECTS_QUERY,
        filters: {
          practice_category: { slug: { $eq: categorySlug } },
        },
        pagination: { page, pageSize: OTHER_PROJECTS_PAGE_SIZE },
      },
      tags: ["other-projects", `other-projects:${categorySlug}`],
    },
  );
}

/**
 * Fetches every other-project page for one URL category. Strapi performs the
 * relation filter, so `/architecture` never downloads the other disciplines.
 */
export async function getOtherProjectsByCategory(
  categorySlug: string,
): Promise<OtherProject[]> {
  try {
    const firstPage = await fetchPage(categorySlug, 1);
    const pageCount = firstPage.meta.pagination?.pageCount ?? 1;
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
        fetchPage(categorySlug, index + 2),
      ),
    );
    return [
      ...firstPage.data,
      ...remainingPages.flatMap((response) => response.data),
    ]
      .map(normalizeOtherProject)
      .filter(
        (project): project is OtherProject =>
          project !== null && project.category === categorySlug,
      );
  } catch (error) {
    logStrapiError(`getOtherProjectsByCategory(${categorySlug})`, error);
    return [];
  }
}
