
import { type Provider } from "@supabase/supabase-js";
import { supabase } from "./client";



export type AuthError = {
  message: string;
  status: number;
};

export const authService = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw { message: error.message, status: 400 };
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw { message: error.message, status: 401 };
    return data;
  },

  signInWithProvider: async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw { message: error.message, status: 400 };
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw { message: error.message, status: 400 };
  },

  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw { message: error.message, status: 400 };
    return session;
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw { message: error.message, status: 400 };
    return user;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw { message: error.message, status: 400 };
  },

  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw { message: error.message, status: 400 };
  },
};
