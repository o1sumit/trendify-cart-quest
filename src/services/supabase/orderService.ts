import { supabase } from "@/lib/supabase";
import { mapOrder, type Order } from "@/lib/types";

export const orderService = {
  async getByUserId(userId: string): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!orders?.length) return [];

    const orderIds = orders.map((o) => o.id);
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, products(*)")
      .in("order_id", orderIds);

    if (itemsError) throw itemsError;

    return orders.map((order) => {
      const orderItems = (items ?? []).filter((i) => i.order_id === order.id);
      return mapOrder(order, orderItems);
    });
  },

  async checkout(taxRate = 0.08): Promise<string> {
    const { data, error } = await supabase.rpc("checkout_cart", {
      tax_rate: taxRate,
    });

    if (error) throw error;
    return data as string;
  },
};
