import { supabase } from "@/lib/supabase";
import { mapProduct, type Product } from "@/lib/types";

export interface CartItemRecord {
  product: Product;
  quantity: number;
}

export const cartService = {
  async getItems(userId: string): Promise<CartItemRecord[]> {
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity, products(*)")
      .eq("user_id", userId);

    if (error) throw error;

    return (data ?? [])
      .filter((row) => row.products)
      .map((row) => ({
        product: mapProduct(row.products as never),
        quantity: row.quantity,
      }));
  },

  async upsertItem(userId: string, productId: string, quantity: number) {
    const { error } = await supabase.from("cart_items").upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: "user_id,product_id" }
    );

    if (error) throw error;
  },

  async removeItem(userId: string, productId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  },

  async clear(userId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },
};
