import { supabase } from "@/utils/supabase/client";
import useSWR from "swr";
import { PortfolioWithToken } from "@/types/database";

export const fetchUserTokens = async (): Promise<PortfolioWithToken[]> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("user_portfolios")
      .select(
        `
        *,
        token:tokens(*)
      `
      )
      .eq("user_id", session.user.id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    throw new Error("Error fetching user tokens");
  }
};

function useTokens() {
  const { data, error, isLoading } = useSWR<PortfolioWithToken[]>(
    "userTokens",
    fetchUserTokens,
    {
      revalidateOnFocus: false,
      focusThrottleInterval: 60000 * 5, // 5 minutes
      onSuccess: (data) => {
        console.debug("User tokens fetched successfully");
      },
      onError: (error) => {
        console.error("Error fetching user tokens:", error);
      },
    }
  );

  return {
    tokens: data,
    isLoading,
    error,
  };
}

export default useTokens;
