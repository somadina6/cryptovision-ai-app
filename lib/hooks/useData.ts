import useSWR from "swr";
import { fetcher } from "@/utils/axios/axios";
import { PortfolioWithToken } from "@/types/database";
import { Token } from "@/types/types";

// Reusable SWR configuration
const DEFAULT_SWR_CONFIG = {
  revalidateOnFocus: false,
  dedupingInterval: 30000, // 30 seconds
};

// Hook for fetching user's tokens
export function useUserTokens() {
  return useSWR<PortfolioWithToken[]>("/token", fetcher, {
    ...DEFAULT_SWR_CONFIG,
    refreshInterval: 60000, // Refresh every minute
  });
}

// Hook for fetching currency rates
export function useCurrencyRates() {
  return useSWR("/exchange", fetcher, {
    ...DEFAULT_SWR_CONFIG,
    refreshInterval: 1800000, // Refresh every 30 minutes
  });
}

// Hook for fetching Fear & Greed Index
export function useFearGreedIndex() {
  return useSWR("/fear-greed", fetcher, {
    ...DEFAULT_SWR_CONFIG,
    refreshInterval: 3600000, // Refresh every hour
  });
}

// Hook for searching tokens with debouncing
export function useTokenSearch(query: string) {
  return useSWR(
    query ? `/token/search/${encodeURIComponent(query)}` : null,
    fetcher,
    {
      ...DEFAULT_SWR_CONFIG,
      revalidateOnFocus: true,
      dedupingInterval: 5000, // 5 seconds for search results
    }
  );
}

// Hook for fetching single token details
export function useTokenDetails(tokenId: string) {
  return useSWR(tokenId ? `/token/${tokenId}` : null, fetcher, {
    ...DEFAULT_SWR_CONFIG,
    refreshInterval: 30000, // Refresh every 30 seconds
  });
}
