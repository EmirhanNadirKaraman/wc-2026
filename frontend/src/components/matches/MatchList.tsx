import type { Match } from "../../types";
import { MatchCard } from "./MatchCard";

interface Props {
  matches: Match[];
}

function groupByDate(matches: Match[]): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const dateKey = new Date(m.match_date).toLocaleDateString("tr-TR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul",
    });
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(m);
  }
  return map;
}

export const MatchList = ({ matches }: Props) => {
  if (matches.length === 0) {
    return <p className="empty">Henüz maç yok.</p>;
  }

  const grouped = groupByDate(matches);

  return (
    <div className="match-list">
      {[...grouped.entries()].map(([date, dayMatches]) => (
        <div key={date} className="match-list__day">
          <h3 className="match-list__date-header">{date}</h3>
          {dayMatches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ))}
    </div>
  );
};
