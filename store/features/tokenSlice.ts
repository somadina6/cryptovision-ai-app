import { TokenData } from "../../types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TokenState = {
  sum: number;
  userTokens: TokenData[] | null;
  change_24hr: number;
  sum_change_24hr: number;
  all_time_high: number;
};

const initialState: TokenState = {
  userTokens: [],
  sum: 0,
  sum_change_24hr: 0,
  change_24hr: 0,
  all_time_high: 0,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setUserTokens: (state, action: PayloadAction<TokenData[]>) => {
      const tokens = action.payload;
      // If the payload is a string, it means the user is not authenticated
      if (!tokens || typeof tokens == "string") return;
      state.userTokens = tokens;

      let sum = 0;
      let sum_change_24hr = 0;
      let sum_all_time_high = 0;

      tokens.forEach(({ token, amount }) => {
        const current = token.current_price * amount;
        const change_percentage = token.price_change_percentage_24h / 100;
        const previous = current / (1 + change_percentage);

        sum += current;
        sum_change_24hr += current - previous;
        sum_all_time_high += token.ath??0 * amount;
        
      });

      // Store Balance Sum and Change in 24hr
      state.sum = sum;
      state.sum_change_24hr = sum_change_24hr;

      // Store Balance Change Percentage
      state.change_24hr =
        sum !== 0 ? (sum_change_24hr / (sum - sum_change_24hr)) * 100 : 0;
    },
  },
});

export const { setUserTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
