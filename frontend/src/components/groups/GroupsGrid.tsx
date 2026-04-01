import type { GroupsResponse } from "../../types";
import { GroupTable } from "./GroupTable";

interface Props {
  groups: GroupsResponse;
}

export const GroupsGrid = ({ groups }: Props) => {
  const sortedGroups = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  if (sortedGroups.length === 0) {
    return <p className="empty">Grup verisi henüz mevcut değil.</p>;
  }

  return (
    <div className="groups-grid">
      {sortedGroups.map(([name, teams]) => (
        <GroupTable key={name} groupName={name} teams={teams} />
      ))}
    </div>
  );
};
