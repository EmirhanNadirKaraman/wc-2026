import type { TabId } from "../layout/TabNav";

interface Props {
  onNavigate: (tab: TabId) => void;
}

const LINKS: { id: TabId; label: string }[] = [
  { id: "standings", label: "Puan Durumu" },
  { id: "matches", label: "Maçlar" },
  { id: "groups", label: "Gruplar" },
  { id: "bracket", label: "Ağaç" },
  { id: "predictions", label: "Tahminler" },
];

export const QuickLinks = ({ onNavigate }: Props) => (
  <div className="quick-card card">
    <div className="section-head">
      <h2>Hızlı Geçiş</h2>
      <span className="pill">Kısa yol</span>
    </div>
    <div className="quick-links">
      {LINKS.map((l) => (
        <button key={l.id} className="quick-link" onClick={() => onNavigate(l.id)}>
          {l.label}
        </button>
      ))}
    </div>
  </div>
);
