import { getTokens } from "@/utils/apis/apis";
import useSWR from "swr";

export const fetchUserTokens = async () => {
  try {
    const tokens = await getTokens();
    return tokens;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    throw new Error("Error fetching user tokens");
  }
};

function useTokens() {
  const { data, error, isValidating, mutate } = useSWR(
    'fetchUserTokens',
    fetchUserTokens,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 1800000, // 30 minutes
      dedupingInterval: 5000, // 5 seconds
      errorRetryInterval: 10000, // 10 seconds
      errorRetryCount: 3,
      onSuccess: (data) => {
        console.log('Tokens fetched successfully', data);
      },
      onError: (error) => {
        console.error('Error fetching tokens', error);
      },
      shouldRetryOnError: (err) => {
        return !(err instanceof Error && err.message === "Error fetching user tokens");
      },
      compare: (a, b) => {
        if (!a || !b) return false;
        return JSON.stringify(a) === JSON.stringify(b);
      },
    }
  );

  const isLoading = !error && !data;

  return {
    tokens: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

export default useTokens;
