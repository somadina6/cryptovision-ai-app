import { getTokens } from "@/utils/apis/apis";
import useSWR from "swr";

function useTokens() {
  const { data, error, isValidating, mutate } = useSWR(
    'fetchUserTokens',
    getTokens,
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
        // Adjust based on actual error structure of getTokens
        return !(err instanceof Error && err.message.includes("Error fetching tokens"));
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
