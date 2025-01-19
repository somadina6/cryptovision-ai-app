import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CurrencyState = {
  rates: Record<string, number>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastUpdated: string | null;
};

const initialState: CurrencyState = {
  rates: {},
  status: "idle",
  error: null,
  lastUpdated: null,
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencyRates: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      state.rates = action.payload;
      state.status = "succeeded";
      state.lastUpdated = new Date().toISOString();
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearRates: (state) => {
      state.rates = {};
      state.status = "idle";
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const { setCurrencyRates, setLoading, setError, clearRates } =
  currencySlice.actions;

// Selectors
export const selectCurrencyRates = (state: RootState) => state.currency.rates;
export const selectCurrencyStatus = (state: RootState) => state.currency.status;
export const selectCurrencyError = (state: RootState) => state.currency.error;
export const selectLastUpdated = (state: RootState) =>
  state.currency.lastUpdated;

export default currencySlice.reducer;
