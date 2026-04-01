import { BracketView } from "../components/bracket/BracketView";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useBracket } from "../hooks/useBracket";

export const BracketPage = () => {
  const { data, isLoading, isError } = useBracket();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message="Turnuva ağacı yüklenemedi." />;

  return (
    <section className="page">
      <h2 className="page__title">Turnuva Ağacı</h2>
      {data && <BracketView bracket={data} />}
    </section>
  );
};
