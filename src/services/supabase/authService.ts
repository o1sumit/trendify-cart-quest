import { supabase } from "@/lib/supabase";
import type { LoginPayload, SignupPayload } from "@/lib/types";

export const authService = {
  async signUp({ fullName, username, email, password }: SignupPayload) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn({ email, password }: LoginPayload) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
