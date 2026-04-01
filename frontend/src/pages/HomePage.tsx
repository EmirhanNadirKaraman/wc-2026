import { TournamentCountdown, TurkeyCountdown } from "../components/home/CountdownCard";
import { FeaturedMatch } from "../components/home/FeaturedMatch";
import { LeaderPulse } from "../components/home/LeaderPulse";
import { QuickLinks } from "../components/home/QuickLinks";
import { TodayMatches } from "../components/home/TodayMatches";
import { useHome } from "../hooks/useHome";
import { useMeta } from "../hooks/useMeta";
import { useStandings } from "../hooks/useStandings";
import { formatRelativeTime } from "../utils/formatDate";
import { TOURNAMENT_START_UTC } from "../utils/constants";
import type { TabId } from "../components/layout/TabNav";

interface Props {
  onNavigate: (tab: TabId) => void;
}

export const HomePage = ({ onNavigate }: Props) => {
  const { data: home, isLoading: homeLoading } = useHome();
  const { data: meta } = useMeta();
  const { data: standings } = useStandings();

  const leader = standings?.standings[0];

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-main card">
          <div className="hero-flagline">L.T.A.S. 🇹🇷 World Cup'26 🏆</div>
          <h1 className="hero-title">L.T.A.S. World Cup 2026</h1>
          <p className="hero-subtitle">Dünya Kupası Tahmin Ligi</p>
          <div className="hero-badges">
            <span className="badge">Canlı Puan Takibi</span>
            <span className="badge">Türkiye Odaklı Takip</span>
            <span className="badge">Tahmin Ligi</span>
          </div>

          <div className="countdown-grid">
            <TournamentCountdown startUtc={TOURNAMENT_START_UTC} />
            <TurkeyCountdown match={home?.turkey_next_match ?? null} />
          </div>
        </div>

        <div className="hero-side">
          <div className="card stat">
            <div className="stat-label">Lider</div>
            <div className="stat-value">{leader?.participant ?? "–"}</div>
            <div className="stat-sub">{leader ? `${leader.points} puan` : "yükleniyor..."}</div>
          </div>
          <div className="card stat">
            <div className="stat-label">Katılımcı</div>
            <div className="stat-value">{standings?.standings.length ?? "–"}</div>
            <div className="stat-sub">aktif kullanıcı</div>
          </div>
          <div className="card stat">
            <div className="stat-label">Maçlar</div>
            <div className="stat-value">
              {meta ? `${meta.played} / ${meta.total_matches}` : "–"}
            </div>
            <div className="stat-sub">oynanan / toplam</div>
          </div>
          <div className="card stat">
            <div className="stat-label">Son Senkron</div>
            <div className="stat-value stat-value--sm">
              {meta?.last_sync ? formatRelativeTime(meta.last_sync) : "–"}
            </div>
            <div className="stat-sub">canlı güncelleme</div>
          </div>
        </div>
      </div>

      {/* Home grid */}
      <div className="home-grid">
        <FeaturedMatch match={home?.featured_match ?? null} loading={homeLoading} />
        <TodayMatches matches={home?.today_matches ?? []} loading={homeLoading} />
        <LeaderPulse standings={standings?.standings ?? []} loading={homeLoading} />
        <QuickLinks onNavigate={onNavigate} />
      </div>
    </div>
  );
};
