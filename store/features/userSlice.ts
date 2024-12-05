import { currencies } from "@/public/currencies/currencies";
import { Currency } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  userId: string | null;
  name?: string | null | undefined;
  image?: string | null | undefined;
  status: "authenticated" | "unauthenticated" | "loading";
  preferred_currency: Currency;
};

const initialState: UserState = {
  userId: null,
  status: "unauthenticated",
  preferred_currency: currencies[0],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setUserStatus: (
      state,
      action: PayloadAction<"authenticated" | "unauthenticated" | "loading">
    ) => {
      state.status = action.payload;
    },
    setUserImage: (state, action: PayloadAction<string | null | undefined>) => {
      state.image = action.payload;
    },
    setUserName: (state, action: PayloadAction<string | null | undefined>) => {
      state.name = action.payload;
    },
    setUserCurrency: (state, action: PayloadAction<Currency>) => {
      state.preferred_currency = action.payload;
    },
  },
});

export const {
  setUserId,
  setUserStatus,
  setUserImage,
  setUserName,
  setUserCurrency,
} = userSlice.actions;

export default userSlice.reducer;
