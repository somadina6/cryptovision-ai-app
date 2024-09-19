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
    fetchUserTokens,
    fetchUserTokens,
    {
      revalidateOnFocus: false,
      refreshInterval: 1800000, // 30 minutes
      dedupingInterval: 5000, // 5 seconds
    }
  );
  return {
    tokens: data,
    isLoading,
    error,
  };
}
export default useTokens;
