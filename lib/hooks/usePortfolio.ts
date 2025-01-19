import { useState, useEffect } from "react";
import { getUserId, getUserPortfolio } from "@/utils/supabase/queries";
import { PortfolioWithToken } from "@/types/database";

/**
 * @deprecated Use useTokens hook instead - it provides better caching and performance
 * @returns {PortfolioWithToken[]} portfolio - The user's portfolio
 * @returns {boolean} isLoading - Whether the portfolio is loading
 * @returns {Error | null} error - The error if there is one
 */
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioWithToken[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const userId = await getUserId();
        if (!userId) {
          throw new Error("User not authenticated");
        }
        const data = await getUserPortfolio(userId);
        setPortfolio(data as PortfolioWithToken[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  return { portfolio, isLoading, error };
}
