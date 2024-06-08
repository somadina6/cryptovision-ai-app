import { TokenData } from "@/utils/apis/apis";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TokenState = {
  sum: number;
  userTokens: TokenData[];
};

const initialState: TokenState = {
  sum: 0,
  userTokens: [],
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setUserTokens: (state, action: PayloadAction<TokenData[]>) => {
      let sum = 0;
      const tokens = action.payload;
      state.userTokens = tokens;

      tokens.forEach((coin) => {
        sum += coin.price * coin.amount;
      });
      state.sum = sum;
    },

    setSum: (state, action: PayloadAction<TokenData[]>) => {
      let sum = 0;
      const tokens = state.userTokens;
      if (tokens) {
        tokens.forEach((coin) => {
          sum += coin.price * coin.amount;
        });
      }
      state.sum = sum;
    },
  },
});

export const { setUserTokens, setSum } = tokenSlice.actions;

export default tokenSlice.reducer;
