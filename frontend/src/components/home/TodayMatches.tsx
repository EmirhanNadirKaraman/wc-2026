import type { HomeMatch } from "../../types";
import { MATCH_STATUS_LABELS } from "../../utils/constants";
import { formatOnlyTime } from "../../utils/formatDate";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  matches: HomeMatch[];
  loading?: boolean;
}

export const TodayMatches = ({ matches, loading }: Props) => {
  const displayed = matches.slice(0, 6);

  return (
    <div className="mini-card card">
      <div className="section-head">
        <h2>Bugün Oynanacak</h2>
        <span className="pill">
          {loading && !matches.length ? "yükleniyor" : `${matches.length} maç`}
        </span>
      </div>
      <div className="mini-list">
        {loading && !matches.length ? (
          <>
            <div className="mini-match skeleton-line" />
            <div className="mini-match skeleton-line" />
            <div className="mini-match skeleton-line" />
          </>
        ) : displayed.length === 0 ? (
          <div className="mini-match">
            <div className="mm-time">–</div>
            <div className="mm-teams">Bugün maç görünmüyor</div>
          </div>
        ) : (
          displayed.map((m) => (
            <div key={m.id} className={`mini-match${m.is_live ? " mini-match--live" : ""}`}>
              <div className="mm-time">{formatOnlyTime(m.match_date)}</div>
              <div className="mm-teams">
                {teamDisplay(m.home_team)} vs {teamDisplay(m.away_team)}
              </div>
              <div className="pill">
                {m.is_live ? (
                  <><span className="live-dot" /> Canlı</>
                ) : (
                  MATCH_STATUS_LABELS[m.status] ?? m.status
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
