import { PredictionCard } from "../components/predictions/PredictionCard";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import type { ParticipantFullPredictions } from "../types";
import { client } from "../api/client";
import { useQuery } from "@tanstack/react-query";

const fetchAllPredictions = async (): Promise<ParticipantFullPredictions[]> => {
  // Fetch summary list to get names, then full predictions per participant
  const { data: summaries } = await client.get<{ name: string }[]>("/predictions");
  const details = await Promise.all(
    summaries.map((s) =>
      client
        .get<ParticipantFullPredictions>(`/predictions/${encodeURIComponent(s.name)}`)
        .then((r) => r.data)
    )
  );
  return details;
};

export const PredictionsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["predictions-full"],
    queryFn: fetchAllPredictions,
    staleTime: 60_000,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message="Tahminler yüklenemedi." />;

  return (
    <section className="page">
      <h2 className="page__title">Tahminler</h2>
      {!data?.length ? (
        <p className="empty">Henüz tahmin bulunamadı.</p>
      ) : (
        <div className="pred-grid">
          {data.map((p) => (
            <PredictionCard key={p.name} participant={p} />
          ))}
        </div>
      )}
    </section>
  );
};
