import type { Match } from "../../types";
import { MATCH_STATUS_LABELS } from "../../utils/constants";
import { formatOnlyTime } from "../../utils/formatDate";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  match: Match;
}

export const MatchCard = ({ match }: Props) => {
  const hasScore = match.home_score !== null && match.away_score !== null;
  const isLive = match.status === "LIVE";
  const statusLabel = MATCH_STATUS_LABELS[match.status] ?? match.status;

  return (
    <div className={`match-line${isLive ? " live" : ""}`}>
      <div className="match-time">{formatOnlyTime(match.match_date)}</div>
      <div className="match-team">{teamDisplay(match.home_team)}</div>
      <div className="match-score">
        {hasScore ? `${match.home_score} – ${match.away_score}` : "–"}
      </div>
      <div className="match-team match-team--away">{teamDisplay(match.away_team)}</div>
      <div className="match-status pill">
        {isLive ? <><span className="live-dot" /> Şimdi Canlı</> : statusLabel}
      </div>
    </div>
  );
};
