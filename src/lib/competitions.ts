import type { Competition, CompetitionImage } from "@/types/competition";
import type {
  StrapiCollectionResponse,
  StrapiCompetitionEntry,
} from "@/types/strapi";
import {
  fetchStrapiData,
  getStrapiMediaUrl,
  logStrapiError,
  STRAPI_REVALIDATE_SECONDS,
} from "@/lib/strapi";

const COMPETITIONS_ENDPOINT = "/competitions";
const COMPETITIONS_PAGE_SIZE = 100;

const COMPETITIONS_QUERY = {
  fields: ["documentId", "name"],
  populate: {
    competition_image: {
      fields: ["url", "alternativeText", "width", "height"],
    },
  },
  sort: ["id:asc"],
};

function optionalDimension(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function normalizeCompetitionEntry(
  entry: StrapiCompetitionEntry | null,
): Competition | null {
  const name = entry?.name?.trim();
  if (!entry || !name) return null;

  const competitionId = String(entry.documentId ?? entry.id);
  const images = (entry.competition_image ?? [])
    .map((image, index): CompetitionImage | null => {
      const src = getStrapiMediaUrl(image?.url);
      if (!image || !src) return null;

      return {
        id: String(image.documentId ?? image.id ?? `${competitionId}-${index + 1}`),
        src,
        alt:
          image.alternativeText?.trim() ||
          `${name} competition image ${index + 1}`,
        width: optionalDimension(image.width),
        height: optionalDimension(image.height),
      };
    })
    .filter((image): image is CompetitionImage => image !== null);

  if (images.length === 0) return null;

  return {
    id: competitionId,
    name,
    images,
  };
}

async function fetchCompetitionPage(page: number) {
  return fetchStrapiData<
    StrapiCollectionResponse<StrapiCompetitionEntry | null>
  >(COMPETITIONS_ENDPOINT, {
    query: {
      ...COMPETITIONS_QUERY,
      pagination: { page, pageSize: COMPETITIONS_PAGE_SIZE },
    },
    revalidate: STRAPI_REVALIDATE_SECONDS,
    tags: ["competitions"],
  });
}

/** Fetches every competition page and returns only serializable UI data. */
export async function getCompetitions(): Promise<Competition[]> {
  try {
    const firstPage = await fetchCompetitionPage(1);
    const pageCount = firstPage.meta.pagination?.pageCount ?? 1;
    const remainingPages =
      pageCount > 1
        ? await Promise.all(
            Array.from({ length: pageCount - 1 }, (_, index) =>
              fetchCompetitionPage(index + 2),
            ),
          )
        : [];

    return [firstPage, ...remainingPages]
      .flatMap((page) => (Array.isArray(page.data) ? page.data : []))
      .map(normalizeCompetitionEntry)
      .filter((competition): competition is Competition => competition !== null);
  } catch (error) {
    logStrapiError("getCompetitions", error);
    return [];
  }
}
