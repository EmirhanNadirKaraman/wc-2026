import { StandingsTable } from "../components/standings/StandingsTable";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useStandings } from "../hooks/useStandings";

export const StandingsPage = () => {
  const { data, isLoading, isError } = useStandings();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message="Puan durumu yüklenemedi." />;

  return (
    <section className="page">
      <div className="page__header">
        <h2 className="page__title">Puan Durumu</h2>
        <p className="page__note">Sıfır puanlı kullanıcılar da görünür</p>
      </div>
      <StandingsTable standings={data?.standings ?? []} />
    </section>
  );
};
