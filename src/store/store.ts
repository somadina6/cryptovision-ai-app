import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/userSlice";
import tokenReducer from "./features/tokenSlice";

export const store = configureStore({
  reducer: {
    user: authReducer,
    token: tokenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
