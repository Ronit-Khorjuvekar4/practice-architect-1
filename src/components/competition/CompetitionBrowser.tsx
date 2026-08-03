"use client";

import { useCallback, useRef, useState } from "react";
import { CompetitionIndex } from "@/components/competition/CompetitionIndex";
import { CompetitionStage } from "@/components/competition/CompetitionStage";
import type { Competition } from "@/types/competition";

type CompetitionBrowserProps = {
  competitions: Competition[];
};

export function CompetitionBrowser({
  competitions,
}: CompetitionBrowserProps) {
  const [selectedId, setSelectedId] = useState(competitions[0].id);
  const imageSectionRef = useRef<HTMLElement>(null);

  const handleSelect = useCallback((competition: Competition) => {
    setSelectedId(competition.id);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.requestAnimationFrame(() => {
        imageSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    }
  }, []);

  const selectedCompetition =
    competitions.find((competition) => competition.id === selectedId) ??
    competitions[0];

  return (
    <div className="mt-12 grid gap-5 lg:h-[620px] lg:grid-cols-[minmax(290px,0.72fr)_minmax(0,1.7fr)] lg:gap-6">
      <CompetitionIndex
        items={competitions}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <CompetitionStage
        key={selectedCompetition.id}
        competition={selectedCompetition}
        stageRef={imageSectionRef}
      />
    </div>
  );
}
