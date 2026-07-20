import type { GalleryImage } from "@/types/photo-gallery";
import type {
  StrapiCollectionResponse,
  StrapiPhotoGalleryEntry,
} from "@/types/strapi";
import {
  fetchStrapiData,
  getStrapiMediaUrl,
  logStrapiError,
  STRAPI_REVALIDATE_SECONDS,
} from "@/lib/strapi";

const PHOTO_GALLERY_ENDPOINT = "/photo-galleries";

const PHOTO_GALLERY_QUERY = {
  fields: ["documentId"],
  populate: {
    gallery_image: {
      fields: ["url", "alternativeText", "width", "height"],
    },
  },
  sort: ["id:asc"],
  pagination: { pageSize: 100 },
};

function optionalDimension(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function normalizePhotoGalleryEntry(
  entry: StrapiPhotoGalleryEntry | null,
): GalleryImage | null {
  if (!entry?.gallery_image?.url) return null;

  const image = entry.gallery_image;
  const url = getStrapiMediaUrl(image.url);
  if (!url) return null;

  return {
    id: entry.documentId ?? entry.id,
    url,
    alternativeText:
      image.alternativeText?.trim() || "Achievement gallery image",
    width: optionalDimension(image.width),
    height: optionalDimension(image.height),
  };
}

/** Fetches and normalizes the homepage photo gallery from Strapi. */
export async function getPhotoGallery(): Promise<GalleryImage[]> {
  try {
    const response = await fetchStrapiData<
      StrapiCollectionResponse<StrapiPhotoGalleryEntry | null>
    >(PHOTO_GALLERY_ENDPOINT, {
      query: PHOTO_GALLERY_QUERY,
      revalidate: STRAPI_REVALIDATE_SECONDS,
      tags: ["photo-gallery"],
    });

    if (!Array.isArray(response.data)) return [];

    return response.data
      .map(normalizePhotoGalleryEntry)
      .filter((image): image is GalleryImage => image !== null);
  } catch (error) {
    logStrapiError("getPhotoGallery", error);
    return [];
  }
}
