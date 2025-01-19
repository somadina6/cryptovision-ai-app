import { Profile } from "@/types/database";
import { supabase } from "./client";

import { Provider } from "@supabase/supabase-js";

// Auth Queries
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: name,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User Profile Queries
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, image, preferred_currency")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id;
};

export const updateUser = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Token Queries
export const searchTokens = async (query: string) => {
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
    .order("market_cap_rank", { ascending: true })
    .limit(10);
  if (error) throw error;
  return data;
};

export const getToken = async (tokenId: string) => {
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("token_id", tokenId)
    .single();
  if (error) throw error;
  return data;
};

// Portfolio Queries
export const getUserPortfolio = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_portfolios")
    .select(
      `
      *,
      token:tokens(*)
    `
    )
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};

export const addToPortfolio = async (
  userId: string,
  tokenId: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from("user_portfolios")
    .insert({
      user_id: userId,
      token_id: tokenId,
      amount,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePortfolioItem = async (
  userId: string,
  tokenId: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from("user_portfolios")
    .update({ amount })
    .eq("user_id", userId)
    .eq("token_id", tokenId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteFromPortfolio = async (userId: string, tokenId: string) => {
  const { error } = await supabase
    .from("user_portfolios")
    .delete()
    .eq("user_id", userId)
    .eq("token_id", tokenId);
  if (error) throw error;
};
