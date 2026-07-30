/**
 * Strapi API helper — the single place that knows how to talk to Strapi.
 *
 * Everything here runs server-side (App Router Server Components, route
 * handlers, `generateMetadata`, `generateStaticParams`). The data functions
 * in `lib/projects.ts` and `lib/categories.ts` build on these primitives.
 */

/** Strapi REST base, e.g. http://localhost:1337/api */
export const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337/api";

/** Strapi origin — used to resolve relative `/uploads/*` media URLs. */
export const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Optional read token for protected endpoints (server-only env var). */
// const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Default ISR window, in seconds, for Strapi reads.
 * Change this one value to re-tune caching across the whole app.
 */
export const STRAPI_REVALIDATE_SECONDS = 300;

/** Thrown when a Strapi request cannot be completed or returns a non-2xx. */
export class StrapiError extends Error {
  readonly status: number;
  readonly endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Logs a Strapi failure clearly on the server. The data functions catch
 * errors and degrade gracefully (return `[]` / `null`) so the UI never
 * crashes — this keeps the underlying cause visible to the developer.
 */
export function logStrapiError(context: string, error: unknown): void {
  const detail =
    error instanceof StrapiError
      ? `${error.message} (status ${error.status})`
      : String(error);
  console.error(`\n[Strapi] ${context} failed.\n  ${detail}\n`);
}

/* ── Query string builder ──────────────────────────────────────────────── */

export type StrapiQueryValue =
  | string
  | number
  | boolean
  | readonly StrapiQueryValue[]
  | { readonly [key: string]: StrapiQueryValue };

export type StrapiQuery = Record<string, StrapiQueryValue>;

/**
 * Serialises a nested object into Strapi's bracket query syntax. For example:
 *
 *   buildStrapiQuery({
 *     fields: ["title", "slug"],
 *     populate: { practice_category: { fields: ["title", "slug"] } },
 *     filters: { slug: { $eq: "house-on-the-cliff" } },
 *   })
 *
 * produces (decoded):
 *
 *   ?fields[0]=title&fields[1]=slug
 *   &populate[practice_category][fields][0]=title
 *   &populate[practice_category][fields][1]=slug
 *   &filters[slug][$eq]=house-on-the-cliff
 */
export function buildStrapiQuery(query: StrapiQuery): string {
  const params = new URLSearchParams();

  const append = (key: string, value: StrapiQueryValue): void => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => append(`${key}[${index}]`, item));
    } else if (typeof value === "object") {
      for (const [childKey, childValue] of Object.entries(value)) {
        append(`${key}[${childKey}]`, childValue);
      }
    } else {
      params.append(key, String(value));
    }
  };

  for (const [key, value] of Object.entries(query)) {
    append(key, value);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/* ── Media URL resolution ──────────────────────────────────────────────── */

/**
 * Resolves a Strapi media path to a fully-qualified URL.
 *
 * - Relative paths (`/uploads/foo.jpg`) are prefixed with `STRAPI_BASE_URL`.
 * - Already-absolute URLs (uploads served from S3/Cloudinary, etc.) are
 *   returned untouched.
 * - Missing input returns an empty string — callers should guard for it.
 */
export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const baseUrl = STRAPI_BASE_URL.replace(/\/+$/, "");
  const mediaPath = url.replace(/^\/+/, "");
  return `${baseUrl}/${mediaPath}`;
}

/* ── Fetch wrapper ─────────────────────────────────────────────────────── */

export interface FetchStrapiOptions {
  /** Nested query object — serialised via `buildStrapiQuery`. */
  query?: StrapiQuery;
  /** ISR window in seconds. Defaults to `STRAPI_REVALIDATE_SECONDS`. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via `revalidateTag`. */
  tags?: string[];
  /**
   * Pass `true` to bypass the cache entirely and always hit Strapi.
   * Use this for preview/draft mode where editors need instant updates.
   */
  noStore?: boolean;
}

/**
 * Fetches and parses a Strapi REST endpoint.
 *
 * The caller chooses the response type, e.g.:
 *   fetchStrapiData<StrapiCollectionResponse<StrapiProject>>("/projects", ...)
 *   fetchStrapiData<StrapiResponse<StrapiProject>>("/projects/:documentId", ...)
 */
export async function fetchStrapiData<T>(
  endpoint: string,
  options: FetchStrapiOptions = {},
): Promise<T> {
  const {
    query,
    revalidate = STRAPI_REVALIDATE_SECONDS,
    tags,
    noStore = false,
  } = options;

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${STRAPI_API_URL}${path}${query ? buildStrapiQuery(query) : ""}`;

  const init: RequestInit = {
    headers: {
      "Content-Type": "application/json"
    },
    ...(noStore
      ? { cache: "no-store" }
      : { next: { revalidate, ...(tags ? { tags } : {}) } }),
  };

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (cause) {
    // Network-level failure — almost always "Strapi isn't running".
    throw new StrapiError(
      `Could not reach Strapi at ${url}. Is the CMS running? — ${String(cause)}`,
      0,
      path,
    );
  }

  if (!response.ok) {
    throw new StrapiError(
      `Request to ${path} returned ${response.status} ${response.statusText}.`,
      response.status,
      path,
    );
  }

  return (await response.json()) as T;
}
