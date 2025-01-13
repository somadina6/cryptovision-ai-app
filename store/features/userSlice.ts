import { currencies } from "@/public/currencies/currencies";
import { Currency } from "@/types/types";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

type UserState = {
  userId: string | null;
  name: string | null;
  image: string | null;
  status: AuthStatus;
  preferred_currency: Currency;
  error: string | null;
};

const initialState: UserState = {
  userId: null,
  name: null,
  image: null,
  status: "unauthenticated",
  preferred_currency: currencies[0],
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: string;
        name?: string | null;
        image?: string | null;
      }>
    ) => {
      state.userId = action.payload.id;
      state.name = action.payload.name ?? null;
      state.image = action.payload.image ?? null;
      state.status = "authenticated";
      state.error = null;
    },
    setUserStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.status = action.payload;
    },
    setUserImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setUserName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    },
    setUserCurrency: (state, action: PayloadAction<Currency>) => {
      state.preferred_currency = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = null;
      state.image = null;
      state.status = "unauthenticated";
      state.error = null;
    },
  },
});

// Action creators
export const {
  setUser,
  setUserStatus,
  setUserImage,
  setUserName,
  setUserCurrency,
  setError,
  clearUser,
} = userSlice.actions;

// Basic selectors
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUserName = (state: RootState) => state.user.name;
export const selectUserImage = (state: RootState) => state.user.image;
export const selectAuthStatus = (state: RootState) => state.user.status;
export const selectPreferredCurrency = (state: RootState) =>
  state.user.preferred_currency;
export const selectUserError = (state: RootState) => state.user.error;

// Memoized selectors
export const selectIsAuthenticated = createSelector(
  [selectAuthStatus],
  (status) => status === "authenticated"
);

export const selectUserProfile = createSelector(
  [selectUserId, selectUserName, selectUserImage],
  (id, name, image) => ({
    id,
    name,
    image,
  })
);

export default userSlice.reducer;
