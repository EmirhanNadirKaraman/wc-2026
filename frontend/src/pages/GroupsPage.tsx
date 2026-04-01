import { GroupsGrid } from "../components/groups/GroupsGrid";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Spinner } from "../components/ui/Spinner";
import { useGroups } from "../hooks/useGroups";

export const GroupsPage = () => {
  const { data, isLoading, isError } = useGroups();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message="Gruplar yüklenemedi." />;

  return (
    <section className="page">
      <h2 className="page__title">Gruplar</h2>
      <GroupsGrid groups={data ?? {}} />
    </section>
  );
};
