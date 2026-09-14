import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "Supabase 환경변수가 설정되지 않았습니다 (.env.local의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 확인)"
  );
}

export const supabase = createClient(url, anonKey);
export const PLANNER_ROW_ID = import.meta.env.VITE_PLANNER_ROW_ID;
