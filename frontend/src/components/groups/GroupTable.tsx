import type { GroupTeam } from "../../types";
import { teamDisplay } from "../../utils/teamTranslations";

interface Props {
  groupName: string;
  teams: GroupTeam[];
}

export const GroupTable = ({ groupName, teams }: Props) => (
  <div className="group-table">
    <h3 className="group-table__title">Grup {groupName}</h3>
    <table>
      <thead>
        <tr>
          <th>Takım</th>
          <th>O</th>
          <th>G</th>
          <th>B</th>
          <th>M</th>
          <th>A</th>
          <th>Y</th>
          <th>AV</th>
          <th>P</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, i) => (
          <tr key={team.team} className={i < 2 ? "row--qualified" : ""}>
            <td className="cell--team">{teamDisplay(team.team)}</td>
            <td>{team.played}</td>
            <td>{team.won}</td>
            <td>{team.drawn}</td>
            <td>{team.lost}</td>
            <td>{team.goals_for}</td>
            <td>{team.goals_against}</td>
            <td>{team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}</td>
            <td className="cell--points">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
