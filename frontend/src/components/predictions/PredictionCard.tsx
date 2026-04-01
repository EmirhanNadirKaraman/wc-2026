import { useState } from "react";
import type { GroupPrediction, ParticipantFullPredictions } from "../../types";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  participant: ParticipantFullPredictions;
}

const GroupBlock = ({ group }: { group: GroupPrediction }) => (
  <div className="pred-group">
    <div className="pred-group-title">Grup {group.group_name}</div>
    <div className="pred-lines">
      <div>1. {teamDisplay(group.r1)}</div>
      <div>2. {teamDisplay(group.r2)}</div>
      <div>3. {teamDisplay(group.r3)}</div>
      <div>4. {teamDisplay(group.r4)}</div>
    </div>
  </div>
);

export const PredictionCard = ({ participant }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`pred-card card${open ? " pred-card--open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="pred-card-top">
        <div>
          <div className="pred-user">{participant.name}</div>
          <div className="pred-full">{participant.groups.length} grup tahmini</div>
        </div>
        <div className="pred-toggle">{open ? "Detayı Kapat" : "Detayı Aç"}</div>
      </div>
      {open && (
        <div className="pred-body">
          {participant.groups.map((g) => (
            <GroupBlock key={g.group_name} group={g} />
          ))}
        </div>
      )}
    </div>
  );
};
