import { CompetitionBrowser } from "@/components/competition/CompetitionBrowser";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getCompetitionDetails,
  getCompetitionPage,
} from "@/lib/competitions";

const INITIAL_PAGE_SIZE = 25;

export function CompetitionsSection() {
  const initialPage = getCompetitionPage({ limit: INITIAL_PAGE_SIZE });
  const initialCompetition = initialPage.items[0];

  if (!initialCompetition) return null;

  const initialDetails = getCompetitionDetails(initialCompetition.id);
  if (!initialDetails) return null;

  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
        <SectionHeading
          index="02"
          eyebrow="Submissions"
          title="Competitions"
          description="Open, invited and international competition entries from the studio archive."
        />

        <CompetitionBrowser
          initialPage={initialPage}
          initialDetails={initialDetails}
        />
      </div>
    </section>
  );
}
