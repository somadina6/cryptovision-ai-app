import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  userId: string | null;
  name?: string | null | undefined;
  image?: string | null | undefined;
  status: "authenticated" | "unauthenticated" | "loading";
};

const initialState: UserState = {
  userId: null,
  status: "unauthenticated",
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
  },
});

export const { setUserId, setUserStatus, setUserImage, setUserName } =
  userSlice.actions;

export default userSlice.reducer;
