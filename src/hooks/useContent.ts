import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Filters = {
  published?: boolean; // undefined = admin (all), true = public (published only)
  categoryTag?: string;
  featured?: boolean;
  search?: string;
};

/**
 * Generic list hook. Works for any table since every tourism content
 * table (recreation_places, sanatoriums, dachas, restaurants,
 * accommodations, attractions) shares the same column shape.
 */
export function useContentList<T>(table: string, filters: Filters = {}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from(table).select("*").order("sort_order", { ascending: true });

    if (filters.published !== undefined) {
      query = query.eq("published", filters.published);
    }
    if (filters.categoryTag) {
      query = query.eq("category_tag", filters.categoryTag);
    }
    if (filters.featured) {
      query = query.eq("featured", true);
    }
    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error: err } = await query;
    if (err) setError(err.message);
    setItems((data as T[]) ?? []);
    setLoading(false);
  }, [table, filters.published, filters.categoryTag, filters.featured, filters.search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}

export function useContentItem<T>(table: string, id: string | undefined) {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.from(table).select("*").eq("id", id).single();
    if (err) setError(err.message);
    setItem((data as T) ?? null);
    setLoading(false);
  }, [table, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { item, loading, error, refetch };
}

export function useContentItemBySlug<T>(table: string, slug: string | undefined) {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from(table)
      .select("*")
      .eq("seo->>slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        setItem((data as T) ?? null);
        setLoading(false);
      });
  }, [table, slug]);

  return { item, loading, error };
}

export async function createContentItem<T>(table: string, payload: Partial<T>) {
  const { data, error } = await supabase.from(table).insert(payload as never).select().single();
  return { data: data as T | null, error: error?.message ?? null };
}

export async function updateContentItem<T>(table: string, id: string, payload: Partial<T>) {
  const { data, error } = await supabase
    .from(table)
    .update(payload as never)
    .eq("id", id)
    .select()
    .single();
  return { data: data as T | null, error: error?.message ?? null };
}

export async function deleteContentItem(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function togglePublish(table: string, id: string, published: boolean) {
  const { error } = await supabase.from(table).update({ published }).eq("id", id);
  return { error: error?.message ?? null };
}
