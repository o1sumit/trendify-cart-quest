import { supabase } from "@/lib/supabase";
import { mapProduct, type Product } from "@/lib/types";

export const productService = {
  async getAll(limit = 50): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map(mapProduct);
  },

  async getTrending(limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("trending", true)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map(mapProduct);
  },

  async getRecommended(limit = 10): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("recommended", true)
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map(mapProduct);
  },

  async getFeatured(limit = 3): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map(mapProduct);
  },

  async getByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug
      );

    const query = supabase.from("products").select("*");

    const { data, error } = isUuid
      ? await query.eq("id", idOrSlug).maybeSingle()
      : await query.eq("slug", idOrSlug).maybeSingle();

    if (error) throw error;
    return data ? mapProduct(data) : null;
  },

  async search(query: string): Promise<Product[]> {
    const term = query.trim();
    if (!term) return [];

    const pattern = `%${term}%`;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(
        `name.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`
      )
      .order("rating", { ascending: false });

    if (error) throw error;

    const products = (data ?? []).map(mapProduct);
    const lower = term.toLowerCase();

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  },
};
