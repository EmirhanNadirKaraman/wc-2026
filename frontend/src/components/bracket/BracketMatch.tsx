import type { BracketMatch as BracketMatchType } from "../../types";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  match: BracketMatchType;
}

export const BracketMatch = ({ match }: Props) => {
  const hasScore = match.home_score !== null && match.away_score !== null;
  const isLive = match.status === "LIVE";

  return (
    <div className={`bracket-match${isLive ? " bracket-match--live" : ""}`}>
      <div className={`bracket-match__team${hasScore && match.home_score! > match.away_score! ? " bracket-match__team--winner" : ""}`}>
        {teamDisplay(match.home_team)}
        {hasScore && <span className="bracket-match__score">{match.home_score}</span>}
      </div>
      <div className={`bracket-match__team${hasScore && match.away_score! > match.home_score! ? " bracket-match__team--winner" : ""}`}>
        {teamDisplay(match.away_team)}
        {hasScore && <span className="bracket-match__score">{match.away_score}</span>}
      </div>
    </div>
  );
};
