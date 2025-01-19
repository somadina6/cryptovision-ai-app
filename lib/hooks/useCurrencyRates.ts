import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCurrencyRates,
  selectCurrencyStatus,
  setCurrencyRates,
  setError,
  setLoading,
} from "@/store/features/currencySlice";

export function useCurrencyRates() {
  const dispatch = useAppDispatch();
  const rates = useAppSelector(selectCurrencyRates);
  const status = useAppSelector(selectCurrencyStatus);

  useEffect(() => {
    async function fetchRates() {
      if (status === "loading") return;

      dispatch(setLoading());
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch currency rates");
        }
        const data = await response.json();
        dispatch(setCurrencyRates(data.rates));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch currency rates"
          )
        );
      } finally {
        dispatch(setLoading());
      }
    }

    if (Object.keys(rates).length === 0 && status === "idle") {
      fetchRates();
    }
  }, [dispatch, rates, status]);

  return rates;
}
