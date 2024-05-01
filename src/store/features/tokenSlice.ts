import { TokenData } from "@/utils/apis/apis";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TokenState = {
  sum: number;
};

const initialState: TokenState = {
  sum: 0,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setSum: (state, action: PayloadAction<TokenData[]>) => {
      let sum = 0;
      action.payload.forEach((coin) => {
        sum += coin.price * coin.amount;
      });
      state.sum = sum;
    },
  },
});

export const { setSum } = tokenSlice.actions;

export default tokenSlice.reducer;
