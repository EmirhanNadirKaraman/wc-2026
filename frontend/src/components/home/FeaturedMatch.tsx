import type { HomeMatch } from "../../types";
import { MATCH_STATUS_LABELS } from "../../utils/constants";
import { formatLongDate } from "../../utils/formatDate";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  match: HomeMatch | null;
  loading?: boolean;
}

export const FeaturedMatch = ({ match, loading }: Props) => {
  if (loading && !match) {
    return (
      <div className="featured-card card">
        <div className="section-head">
          <h2>Öne Çıkan Maç</h2>
          <span className="pill">Bağlanıyor</span>
        </div>
        <div className="skeleton-block" />
      </div>
    );
  }

  const badge = match?.is_live
    ? <span className="pill pill--live"><span className="live-dot" /> Şimdi Canlı</span>
    : match?.is_turkey_match
    ? <span className="pill pill--turkey">Türkiye Maçı</span>
    : <span className="pill">Yaklaşan</span>;

  return (
    <div className="featured-card card">
      <div className="section-head">
        <h2>Öne Çıkan Maç</h2>
        {badge}
      </div>
      {match ? (
        <div className="fm-body">
          <div className="fm-teams">
            <div className="fm-team">{teamDisplay(match.home_team)}</div>
            <div className="fm-score">
              {match.home_score !== null ? `${match.home_score} – ${match.away_score}` : "–"}
            </div>
            <div className="fm-team">{teamDisplay(match.away_team)}</div>
          </div>
          <div className="fm-meta">
            <span className="pill">{formatLongDate(match.match_date)}</span>
            <span className="pill">{MATCH_STATUS_LABELS[match.status] ?? match.status}</span>
            {match.group_name && <span className="pill">Grup {match.group_name}</span>}
          </div>
        </div>
      ) : (
        <p className="empty">Henüz öne çıkan maç yok.</p>
      )}
    </div>
  );
};
