import type { Stage } from "../../types";
import { STAGE_LABELS } from "../../utils/constants";

const ALL_STAGES: (Stage | "ALL")[] = [
  "ALL",
  "GROUP",
  "R32",
  "R16",
  "QF",
  "SF",
  "THIRD",
  "FINAL",
];

interface Props {
  active: Stage | "ALL";
  onChange: (stage: Stage | "ALL") => void;
}

export const StageFilter = ({ active, onChange }: Props) => (
  <div className="stage-filter">
    {ALL_STAGES.map((stage) => (
      <button
        key={stage}
        className={`stage-btn${active === stage ? " stage-btn--active" : ""}`}
        onClick={() => onChange(stage)}
      >
        {stage === "ALL" ? "Tümü" : STAGE_LABELS[stage]}
      </button>
    ))}
  </div>
);
