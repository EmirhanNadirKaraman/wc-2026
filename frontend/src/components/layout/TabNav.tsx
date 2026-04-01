export type TabId = "home" | "standings" | "matches" | "groups" | "bracket" | "predictions" | "admin";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Ana Sayfa" },
  { id: "standings", label: "Puan" },
  { id: "matches", label: "Maçlar" },
  { id: "groups", label: "Gruplar" },
  { id: "bracket", label: "Ağaç" },
  { id: "predictions", label: "Tahminler" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export const TabNav = ({ active, onChange }: Props) => (
  <nav className="bottom-nav card">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        className={`nav-tab${active === tab.id ? " active" : ""}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);
