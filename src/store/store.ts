import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/userSlice";
import tokenReducer from "./features/tokenSlice";

export const store = configureStore({
  reducer: {
    user: authReducer,
    token: tokenReducer,
  },
});

store.subscribe(() => {
  console.log("Sum In Store Updated:", store.getState().token.sum);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
