import { getCompetitionDetails } from "@/lib/competitions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const competition = getCompetitionDetails(id);

  if (!competition) {
    return Response.json({ message: "Competition not found" }, { status: 404 });
  }

  return Response.json(competition, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
