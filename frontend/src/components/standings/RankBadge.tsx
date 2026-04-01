interface Props {
  rank: number;
}

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export const RankBadge = ({ rank }: Props) => {
  if (rank in MEDALS) {
    return <span className="rank-badge rank-badge--medal">{MEDALS[rank]}</span>;
  }
  return <span className="rank-badge">{rank}</span>;
};
