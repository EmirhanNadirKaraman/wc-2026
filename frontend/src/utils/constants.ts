import type { Stage } from "../types";

export const STAGE_LABELS: Record<Stage, string> = {
  GROUP: "Grup Aşaması",
  R32: "Son 32",
  R16: "Son 16",
  QF: "Çeyrek Final",
  SF: "Yarı Final",
  THIRD: "3. lük Maçı",
  FINAL: "Final",
};

export const KNOCKOUT_STAGES: Stage[] = ["R32", "R16", "QF", "SF", "THIRD", "FINAL"];

export const MATCH_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Planlandı",
  TIMED: "Planlandı",
  LIVE: "Canlı",
  IN_PLAY: "Canlı",
  PAUSED: "Devre Arası",
  EXTRA_TIME: "Uzatma",
  PENALTY_SHOOTOUT: "Penaltılar",
  FINISHED: "Bitti",
  POSTPONED: "Ertelendi",
  AWARDED: "Hükmen",
};

export const TOURNAMENT_START_UTC = "2026-06-11T19:00:00Z";
