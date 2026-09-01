import { supabase } from "@/lib/supabase";
import { mapProfile, type User } from "@/lib/types";

export const profileService = {
  async getByUserId(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapProfile(data) : null;
  },

  async update(
    userId: string,
    updates: { name?: string; email?: string; username?: string }
  ): Promise<User> {
    const payload: Record<string, string> = {};
    if (updates.name != null) payload.full_name = updates.name;
    if (updates.email != null) payload.email = updates.email;
    if (updates.username != null) payload.username = updates.username;

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select("*")
      .single();

    if (error) throw error;
    return mapProfile(data);
  },
};
