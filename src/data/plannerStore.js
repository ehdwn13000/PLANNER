const STORAGE_KEY = "planner_data_v1";

function emptyData() {
  return { categories: [], projects: [], items: [], quickNotes: [] };
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyData();
  try {
    const parsed = JSON.parse(raw);
    return {
      categories: parsed.categories ?? [],
      projects: parsed.projects ?? [],
      items: parsed.items ?? [],
      quickNotes: parsed.quickNotes ?? [],
    };
  } catch {
    return emptyData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
