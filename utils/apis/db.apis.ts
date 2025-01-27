import { supabase } from "@/utils/supabase/client";

export async function getTokenDataFromDB({ tokenId }: { tokenId: string }) {
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("id", tokenId)
    .single();

  if (error) throw new Error("Token not found");
  return data;
}
