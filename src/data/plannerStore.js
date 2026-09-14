import { supabase, PLANNER_ROW_ID } from "./supabaseClient";

const TABLE = "planner_data";

function emptyData() {
  return { categories: [], projects: [], items: [], quickNotes: [] };
}

function normalize(parsed) {
  return {
    categories: parsed?.categories ?? [],
    projects: parsed?.projects ?? [],
    items: parsed?.items ?? [],
    quickNotes: parsed?.quickNotes ?? [],
  };
}

export async function loadData() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", PLANNER_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("플래너 데이터를 불러오지 못했습니다", error);
    return emptyData();
  }
  return normalize(data?.data);
}

export async function saveData(data) {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: PLANNER_ROW_ID, data, updated_at: new Date().toISOString() });

  if (error) {
    console.error("플래너 데이터를 저장하지 못했습니다", error);
  }
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
