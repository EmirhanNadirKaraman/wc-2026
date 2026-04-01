import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { TabNav, type TabId } from "./components/layout/TabNav";
import { AdminPage } from "./pages/AdminPage";
import { BracketPage } from "./pages/BracketPage";
import { GroupsPage } from "./pages/GroupsPage";
import { HomePage } from "./pages/HomePage";
import { MatchesPage } from "./pages/MatchesPage";
import { PredictionsPage } from "./pages/PredictionsPage";
import { StandingsPage } from "./pages/StandingsPage";

const VALID_TABS: TabId[] = ["home", "standings", "matches", "groups", "bracket", "predictions", "admin"];

function getHashTab(): TabId {
  const hash = window.location.hash.replace("#", "") as TabId;
  return VALID_TABS.includes(hash) ? hash : "home";
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(getHashTab);

  useEffect(() => {
    const onHashChange = () => setActiveTab(getHashTab());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = (tab: TabId) => {
    window.location.hash = tab;
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <Header onNavigate={handleTabChange} />
      <div id="content">
        {activeTab === "home" && <HomePage onNavigate={handleTabChange} />}
        {activeTab === "standings" && <StandingsPage />}
        {activeTab === "matches" && <MatchesPage />}
        {activeTab === "groups" && <GroupsPage />}
        {activeTab === "bracket" && <BracketPage />}
        {activeTab === "predictions" && <PredictionsPage />}
        {activeTab === "admin" && <AdminPage />}
      </div>
      <TabNav active={activeTab} onChange={handleTabChange} />
    </div>
  );
}

export default App;
