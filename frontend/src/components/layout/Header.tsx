import { useMeta } from "../../hooks/useMeta";
import type { TabId } from "./TabNav";

interface Props {
  onNavigate: (tab: TabId) => void;
}

export const Header = ({ onNavigate }: Props) => {
  const { data: meta } = useMeta();

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Site linki kopyalandı.");
      }
    } catch (_) {}
  };

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">🇹🇷</div>
        <div>
          <div className="brand-eyebrow">L.T.A.S.</div>
          <div className="brand-title">L.T.A.S. World Cup 2026</div>
        </div>
      </div>
      <div className="top-actions">
        <button className="ghost-btn admin-gear" onClick={() => onNavigate("admin")} title="Admin">⚙️</button>
        <button className="ghost-btn" onClick={handleShare}>Paylaş</button>
        {meta?.form_url ? (
          <a className="hero-btn secondary" href={meta.form_url} target="_blank" rel="noopener noreferrer">
            Tahmin Formu
          </a>
        ) : (
          <a className="hero-btn secondary" href="#" aria-disabled="true">Tahmin Formu</a>
        )}
      </div>
    </header>
  );
};
