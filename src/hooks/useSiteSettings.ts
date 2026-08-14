import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { SiteSettings } from "../types/content";

let cache: SiteSettings | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    supabase
      .from("site_settings")
      .select("*")
      .single()
      .then(({ data }) => {
        cache = data as SiteSettings;
        setSettings(cache);
        setLoading(false);
      });
  }, []);

  async function refresh() {
    const { data } = await supabase.from("site_settings").select("*").single();
    cache = data as SiteSettings;
    setSettings(cache);
  }

  return { settings, loading, refresh };
}
