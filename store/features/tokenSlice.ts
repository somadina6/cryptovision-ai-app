import { PortfolioWithToken } from "@/types/database";
import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type TokenState = {
  sum: number;
  userTokens: PortfolioWithToken[];
  change_24hr: number;
  sum_change_24hr: number;
  all_time_high: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TokenState = {
  userTokens: [],
  sum: 0,
  sum_change_24hr: 0,
  change_24hr: 0,
  all_time_high: 0,
  status: "idle",
  error: null,
};

// Helper functions for calculations
const calculateTokenMetrics = (tokens: PortfolioWithToken[]) => {
  let sum = 0;
  let sum_change_24hr = 0;
  let sum_all_time_high = 0;

  tokens.forEach(({ token, amount }) => {
    const current = token.current_price * amount;
    const change_percentage = token.price_change_percentage_24h / 100;
    const previous = current / (1 + change_percentage);

    sum += current;
    sum_change_24hr += current - previous;
    sum_all_time_high += (token.ath ?? 0) * amount;
  });

  const change_24hr =
    sum !== 0 ? (sum_change_24hr / (sum - sum_change_24hr)) * 100 : 0;

  return {
    sum,
    sum_change_24hr,
    sum_all_time_high,
    change_24hr,
  };
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setUserTokens: (state, action: PayloadAction<PortfolioWithToken[]>) => {
      const tokens = action.payload;
      if (!tokens || typeof tokens === "string") return;

      state.userTokens = tokens;
      state.status = "succeeded";

      const metrics = calculateTokenMetrics(tokens);
      state.sum = metrics.sum;
      state.sum_change_24hr = metrics.sum_change_24hr;
      state.change_24hr = metrics.change_24hr;
      state.all_time_high = metrics.sum_all_time_high;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearTokens: (state) => {
      state.userTokens = [];
      state.sum = 0;
      state.sum_change_24hr = 0;
      state.change_24hr = 0;
      state.all_time_high = 0;
      state.status = "idle";
      state.error = null;
    },
  },
});

// Action creators
export const { setUserTokens, setLoading, setError, clearTokens } =
  tokenSlice.actions;

// Selectors
export const selectAllTokens = (state: RootState) => state.token.userTokens;
export const selectTokensStatus = (state: RootState) => state.token.status;
export const selectTokensError = (state: RootState) => state.token.error;
export const selectPortfolioSum = (state: RootState) => state.token.sum;
export const selectPortfolioChange24h = (state: RootState) =>
  state.token.change_24hr;
export const selectPortfolioATH = (state: RootState) =>
  state.token.all_time_high;

// Memoized selectors
export const selectTokenById = createSelector(
  [selectAllTokens, (state: RootState, tokenId: string) => tokenId],
  (tokens, tokenId) => tokens.find((t) => t.token.id === tokenId)
);

export const selectTopPerformingTokens = createSelector(
  [selectAllTokens],
  (tokens) =>
    tokens
      .sort(
        (a, b) =>
          b.token.price_change_percentage_24h -
          a.token.price_change_percentage_24h
      )
      .slice(0, 5)
);

export const selectWorstPerformingTokens = createSelector(
  [selectAllTokens],
  (tokens) =>
    tokens
      .sort(
        (a, b) =>
          a.token.price_change_percentage_24h -
          b.token.price_change_percentage_24h
      )
      .slice(0, 5)
);

export default tokenSlice.reducer;
