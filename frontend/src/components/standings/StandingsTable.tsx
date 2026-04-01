import type { StandingEntry } from "../../types";
import { RankBadge } from "./RankBadge";

interface Props {
  standings: StandingEntry[];
}

export const StandingsTable = ({ standings }: Props) => (
  <div className="table-wrapper">
    <table className="standings-table">
      <thead>
        <tr>
          <th>DERECE</th>
          <th>İSİM</th>
          <th>PUAN</th>
          <th>KUSURSUZ</th>
          <th>DOĞRU LİDER</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((entry) => (
          <tr key={entry.participant} className={entry.rank === 1 ? "row--leader" : ""}>
            <td>
              <RankBadge rank={entry.rank} />
            </td>
            <td className="cell--name">{entry.participant}</td>
            <td>{entry.points}</td>
            <td>{entry.perfect}</td>
            <td>{entry.correct_outcome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
