import { useEffect, useState } from "react";
import { countdownText, formatLongDate } from "../../utils/formatDate";
import { teamDisplay } from "../../utils/teamTranslations";
import type { HomeMatch } from "../../types";

interface TournamentProps {
  startUtc: string;
}

export const TournamentCountdown = ({ startUtc }: TournamentProps) => {
  const [text, setText] = useState(() => countdownText(startUtc));

  useEffect(() => {
    const id = setInterval(() => setText(countdownText(startUtc)), 30_000);
    return () => clearInterval(id);
  }, [startUtc]);

  return (
    <div className="count-card">
      <div className="count-label">Turnuva Başlangıcı</div>
      <div className="count-value">{text}</div>
      <div className="count-sub">11 Haziran 2026 • 22.00</div>
    </div>
  );
};

interface TurkeyProps {
  match: HomeMatch | null;
}

export const TurkeyCountdown = ({ match }: TurkeyProps) => {
  const [text, setText] = useState(() => (match ? countdownText(match.match_date) : "-"));

  useEffect(() => {
    if (!match) return;
    const id = setInterval(() => setText(countdownText(match.match_date)), 30_000);
    return () => clearInterval(id);
  }, [match]);

  const sub = match
    ? `${teamDisplay(match.home_team)} vs ${teamDisplay(match.away_team)} • ${formatLongDate(match.match_date)}`
    : "Türkiye maçı bekleniyor";

  return (
    <div className="count-card">
      <div className="count-label">Türkiye Maçına Kalan</div>
      <div className="count-value">{text}</div>
      <div className="count-sub">{sub}</div>
    </div>
  );
};
