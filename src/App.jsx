import { useState } from "react";
import { PlannerProvider } from "./context/PlannerContext";
import HomeView from "./components/HomeView";
import TodayView from "./components/TodayView";
import WeekView from "./components/WeekView";
import HistoryView from "./components/HistoryView";
import NotesView from "./components/NotesView";
import "./App.css";

const TABS = [
  { key: "home", label: "기본 화면" },
  { key: "notes", label: "빠른 메모" },
  { key: "week", label: "주간 뷰" },
  { key: "today", label: "오늘 할 일" },
  { key: "history", label: "기록" },
];

function App() {
  const [tab, setTab] = useState("home");

  return (
    <PlannerProvider>
      <div className="app">
        <header className="app-header">
          <h1>Planner</h1>
          <nav className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={tab === t.key ? "tab active" : "tab"}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>
        <main className="app-main">
          {tab === "home" && <HomeView />}
          {tab === "today" && <TodayView />}
          {tab === "week" && <WeekView />}
          {tab === "history" && <HistoryView />}
          {tab === "notes" && <NotesView />}
        </main>
      </div>
    </PlannerProvider>
  );
}

export default App;
