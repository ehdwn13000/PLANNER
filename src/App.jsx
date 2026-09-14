import { useRef, useState } from "react";
import { PlannerProvider, usePlanner } from "./context/PlannerContext";
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

function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function ImportButton({ onImport }) {
  const fileInputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("가져오기를 하면 현재 데이터가 모두 덮어써집니다. 계속할까요?")) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        onImport(parsed);
      } catch {
        window.alert("파일을 읽을 수 없습니다. 올바른 백업 파일인지 확인해주세요.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        가져오기
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFile}
      />
    </>
  );
}

function AppShell() {
  const planner = usePlanner();
  const [tab, setTab] = useState("home");

  if (planner.isLoading) {
    return (
      <div className="app">
        <p className="placeholder">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>Planner</h1>
          <div className="header-actions">
            <button type="button" onClick={() => exportData(planner.data)}>
              내보내기
            </button>
            <ImportButton onImport={planner.replaceAll} />
          </div>
        </div>
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
  );
}

function App() {
  return (
    <PlannerProvider>
      <AppShell />
    </PlannerProvider>
  );
}

export default App;
