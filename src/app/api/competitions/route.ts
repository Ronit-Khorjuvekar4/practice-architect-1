import type { NextRequest } from "next/server";
import { getCompetitionPage } from "@/lib/competitions";

export function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");
  const requestedLimit = Number(
    request.nextUrl.searchParams.get("limit") ?? 25,
  );
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 25;

  return Response.json(getCompetitionPage({ cursor, limit }), {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
