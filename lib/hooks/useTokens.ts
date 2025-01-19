import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllTokens,
  selectTokensStatus,
  setError,
  setLoading,
  setUserTokens,
} from "@/store/features/tokenSlice";
import { getUserPortfolio } from "@/utils/supabase/queries";
import { authService } from "@/utils/supabase/auth";
import { PortfolioWithToken } from "@/types/database";

export function useTokens() {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(selectAllTokens);
  const status = useAppSelector(selectTokensStatus);

  useEffect(() => {
    async function fetchTokens() {
      if (status === "loading") return;

      dispatch(setLoading());
      try {
        const session = await authService.getSession();
        if (!session?.user?.id) {
          throw new Error("User not authenticated");
        }
        const userTokens = await getUserPortfolio(session.user.id);
        dispatch(setUserTokens(userTokens || []));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : "Failed to fetch tokens"
          )
        );
      }
    }

    if (tokens.length === 0 && status === "idle") {
      fetchTokens();
    }
  }, [dispatch, tokens, status]);

  return tokens as PortfolioWithToken[];
}
