import type { BracketResponse, Stage } from "../../types";
import { KNOCKOUT_STAGES } from "../../utils/constants";
import { BracketRound } from "./BracketRound";

interface Props {
  bracket: BracketResponse;
}

export const BracketView = ({ bracket }: Props) => (
  <div className="bracket-view">
    <div className="bracket-inner">
      {KNOCKOUT_STAGES.map((stage) => (
        <BracketRound
          key={stage}
          stage={stage as Stage}
          matches={bracket[stage as Stage] ?? []}
        />
      ))}
    </div>
  </div>
);
