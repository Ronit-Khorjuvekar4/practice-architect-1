"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CompetitionIndex } from "@/components/competition/CompetitionIndex";
import { CompetitionStage } from "@/components/competition/CompetitionStage";
import type {
  CompetitionDetails,
  CompetitionPage,
  CompetitionSummary,
} from "@/types/competition";

type CompetitionBrowserProps = {
  initialPage: CompetitionPage;
  initialDetails: CompetitionDetails;
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function CompetitionBrowser({
  initialPage,
  initialDetails,
}: CompetitionBrowserProps) {
  const [items, setItems] = useState(initialPage.items);
  const [nextCursor, setNextCursor] = useState(initialPage.nextCursor);
  const [selectedId, setSelectedId] = useState(initialDetails.id);
  const [details, setDetails] = useState<CompetitionDetails | null>(
    initialDetails,
  );
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const detailsCacheRef = useRef(
    new Map<string, CompetitionDetails>([
      [initialDetails.id, initialDetails],
    ]),
  );
  const detailsRequestRef = useRef<AbortController | null>(null);
  const isFetchingNextRef = useRef(false);

  useEffect(() => {
    return () => detailsRequestRef.current?.abort();
  }, []);

  const loadNextPage = useCallback(async () => {
    if (!nextCursor || isFetchingNextRef.current) return;

    isFetchingNextRef.current = true;
    setIsLoadingNextPage(true);
    setLoadError(null);

    try {
      const page = await fetchJson<CompetitionPage>(
        `/api/competitions?limit=25&cursor=${encodeURIComponent(nextCursor)}`,
      );
      setItems((currentItems) => {
        const knownIds = new Set(currentItems.map((item) => item.id));
        const newItems = page.items.filter((item) => !knownIds.has(item.id));
        return [...currentItems, ...newItems];
      });
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError("Unable to load the next competitions.");
    } finally {
      isFetchingNextRef.current = false;
      setIsLoadingNextPage(false);
    }
  }, [nextCursor]);

  const loadDetails = useCallback(
    (competition: CompetitionSummary, bypassCache = false) => {
      detailsRequestRef.current?.abort();
      setDetailError(null);

      const cachedDetails = detailsCacheRef.current.get(competition.id);
      if (cachedDetails && !bypassCache) {
        setDetails(cachedDetails);
        setIsLoadingDetails(false);
        return;
      }

      const controller = new AbortController();
      detailsRequestRef.current = controller;
      setDetails(null);
      setIsLoadingDetails(true);

      void fetchJson<CompetitionDetails>(
        `/api/competitions/${encodeURIComponent(competition.id)}`,
        controller.signal,
      )
        .then((competitionDetails) => {
          if (controller.signal.aborted) return;
          detailsCacheRef.current.set(competition.id, competitionDetails);
          setDetails(competitionDetails);
          setIsLoadingDetails(false);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setDetailError("Unable to load this competition gallery.");
          setIsLoadingDetails(false);
        });
    },
    [],
  );

  const handleSelect = useCallback(
    (competition: CompetitionSummary) => {
      setSelectedId(competition.id);
      loadDetails(competition);
    },
    [loadDetails],
  );

  const selectedSummary =
    items.find((competition) => competition.id === selectedId) ?? items[0];

  return (
    <div className="mt-12 grid gap-5 lg:h-[620px] lg:grid-cols-[minmax(290px,0.72fr)_minmax(0,1.7fr)] lg:gap-6">
      <CompetitionIndex
        items={items}
        selectedId={selectedId}
        hasNextPage={nextCursor !== null}
        isLoadingNextPage={isLoadingNextPage}
        loadError={loadError}
        onSelect={handleSelect}
        onLoadMore={loadNextPage}
        onRetry={loadNextPage}
      />

      <CompetitionStage
        key={selectedSummary.id}
        summary={selectedSummary}
        details={details?.id === selectedSummary.id ? details : null}
        isLoading={isLoadingDetails}
        error={detailError}
        onRetry={() => loadDetails(selectedSummary, true)}
      />
    </div>
  );
}
