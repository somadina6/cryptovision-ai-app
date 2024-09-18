import { getCurrencyRates } from "@/utils/apis/apis";
import useSWR from "swr";

export default function useCurrencyRates() {
  const { data, isLoading, error } = useSWR(
    "getCurrencyRates",
    getCurrencyRates,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    currencyRates: data,
    isLoading,
    error,
  };
}
