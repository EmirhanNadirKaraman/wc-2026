import { useState } from "react";
import { MatchList } from "../components/matches/MatchList";
import { StageFilter } from "../components/matches/StageFilter";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useMatches } from "../hooks/useMatches";
import type { Stage } from "../types";

export const MatchesPage = () => {
  const [activeStage, setActiveStage] = useState<Stage | "ALL">("ALL");
  const { data, isLoading, isError } = useMatches(
    activeStage === "ALL" ? undefined : activeStage
  );

  return (
    <section className="page">
      <h2 className="page__title">Maçlar</h2>
      <StageFilter active={activeStage} onChange={setActiveStage} />
      {isLoading && <Spinner />}
      {isError && <ErrorMessage message="Maçlar yüklenemedi." />}
      {data && <MatchList matches={data} />}
    </section>
  );
};
