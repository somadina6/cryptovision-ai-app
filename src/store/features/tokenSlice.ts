import { TokenData } from "@/utils/apis/apis";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TokenState = {
  sum: number;
  userTokens: TokenData[];
  change_24hr: number;
  sum_change_24hr: number;
};

const initialState: TokenState = {
  userTokens: [],
  sum: 0,
  sum_change_24hr: 0,
  change_24hr: 0,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setUserTokens: (state, action: PayloadAction<TokenData[]>) => {
      const tokens = action.payload;
      state.userTokens = tokens;

      // Store Total User Balance
      let sum = 0;
      tokens.forEach((coin) => {
        sum += coin.price * coin.amount;
      });
      state.sum = sum;

      // Store User Balance 24HR Change
      let sum_change_24hr = 0;
      tokens.forEach((coin) => {
        const current = coin.price * coin.amount;
        const change_percentage = coin.price_change_percentage_24h / 100;
        const previous = current / (1 + change_percentage);
        sum_change_24hr += current - previous;
      });
      state.sum_change_24hr = sum_change_24hr;

      // Store balance Change Percentag
      state.change_24hr =
        (state.sum_change_24hr / (state.sum - state.sum_change_24hr)) * 100;
    },
  },
});

export const { setUserTokens } = tokenSlice.actions;

export default tokenSlice.reducer;
