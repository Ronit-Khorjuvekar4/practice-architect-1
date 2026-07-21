import { CompetitionBrowser } from "@/components/competition/CompetitionBrowser";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Competition } from "@/types/competition";

type CompetitionsSectionProps = {
  competitions: Competition[];
};

export function CompetitionsSection({
  competitions,
}: CompetitionsSectionProps) {
  if (competitions.length === 0) return null;

  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
        <SectionHeading
          index="03"
          eyebrow="Submissions"
          title="Competitions"
          description="Open, invited and international competition entries from the studio archive."
        />

        <CompetitionBrowser competitions={competitions} />
      </div>
    </section>
  );
}
