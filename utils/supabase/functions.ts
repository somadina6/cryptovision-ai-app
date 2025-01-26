import { supabase } from "./client";

export async function invokeUpdateTokens() {
  try {
    const { data, error } = await supabase.functions.invoke("update-tokens", {
      body: {},
    });

    if (error) {
      console.error("Error invoking update-tokens function:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to invoke update-tokens function:", error);
    throw error;
  }
}
