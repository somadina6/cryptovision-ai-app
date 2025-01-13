import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import tokenReducer from "./features/tokenSlice";
import currencyReducer from "./features/currencySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    token: tokenReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
