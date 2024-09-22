import { getTokens } from "@/utils/apis/apis";
import useSWR, { useSWRConfig } from "swr";
export const fetchUserTokens = async (userId: string) => {
  try {
    const tokens = await getTokens();
    return tokens;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    throw new Error("Error fetching user tokens");
  }
};
function useTokens() {
  const { data, isLoading, error } = useSWR(
    "fetchUserTokens",
    fetchUserTokens,
    {
      revalidateOnFocus: false,
      focusThrottleInterval: 60000 * 5, // 5 minutes
      onSuccess: (data) => {
        console.debug("Tokens fetched successfully");
      },
      onError: (error) => {
        console.error("Error fetching tokens", error);
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
