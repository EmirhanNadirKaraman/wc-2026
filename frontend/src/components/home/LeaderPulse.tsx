import { useEffect, useRef } from "react";
import type { StandingEntry } from "../../types";

interface Props {
  standings: StandingEntry[];
  loading?: boolean;
}

const STORAGE_KEY = "ltas_last_leader";

export const LeaderPulse = ({ standings, loading }: Props) => {
  const leader = standings[0];
  const second = standings[1];
  const changeTextRef = useRef<string>("Zirve sabit görünüyor.");

  useEffect(() => {
    if (!leader) return;
    const last = localStorage.getItem(STORAGE_KEY);
    if (last && last !== leader.participant) {
      changeTextRef.current = `Yeni lider: ${leader.participant}`;
    } else {
      changeTextRef.current = "Zirve sabit görünüyor.";
    }
    localStorage.setItem(STORAGE_KEY, leader.participant);
  }, [leader?.participant]);

  if (loading && !standings.length) {
    return (
      <div className="mini-card card">
        <div className="section-head">
          <h2>Zirve</h2>
          <span className="pill">Liderlik Durumu</span>
        </div>
        <div className="skeleton-lines">
          <div /><div /><div />
        </div>
      </div>
    );
  }

  const diff = leader && second ? Math.max(0, leader.points - second.points) : 0;
  const subText = second
    ? `${diff} puan farkla önde`
    : "zirvede tek başına";

  return (
    <div className="mini-card card">
      <div className="section-head">
        <h2>Zirve</h2>
        <span className="pill">Liderlik Durumu</span>
      </div>
      <div className="lp-body">
        <div className="lp-title">{leader?.participant ?? "–"}</div>
        <div className="lp-sub">{leader ? `${leader.points} puan • ${subText}` : ""}</div>
        <div className="lp-sub">{changeTextRef.current}</div>
      </div>
    </div>
  );
};
