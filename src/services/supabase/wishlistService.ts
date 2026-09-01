import { supabase } from "@/lib/supabase";
import { mapProduct, type Product } from "@/lib/types";

export const wishlistService = {
  async getItems(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? [])
      .filter((row) => row.products)
      .map((row) => mapProduct(row.products as never));
  },

  async add(userId: string, productId: string) {
    const { error } = await supabase.from("wishlist_items").upsert(
      { user_id: userId, product_id: productId },
      { onConflict: "user_id,product_id" }
    );

    if (error) throw error;
  },

  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  },
};
