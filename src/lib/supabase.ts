import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Xonabod] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY topilmadi. .env faylini sozlang (.env.example ga qarang)."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
export const STORAGE_BUCKET = "xonabod-media";
