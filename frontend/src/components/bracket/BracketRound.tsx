import type { BracketMatch as BracketMatchType, Stage } from "../../types";
import { STAGE_LABELS } from "../../utils/constants";
import { BracketMatch } from "./BracketMatch";

interface Props {
  stage: Stage;
  matches: BracketMatchType[];
}

export const BracketRound = ({ stage, matches }: Props) => (
  <div className="bracket-round">
    <h3 className="bracket-round__title">{STAGE_LABELS[stage]}</h3>
    <div className="bracket-round__matches">
      {matches.length === 0 ? (
        <p className="bracket-round__empty">TBD</p>
      ) : (
        matches.map((m) => <BracketMatch key={m.id} match={m} />)
      )}
    </div>
  </div>
);
