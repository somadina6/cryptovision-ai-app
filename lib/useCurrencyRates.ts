import { getCurrencyRates } from "@/utils/apis/apis";
import useSWR from "swr";

export default function useCurrencyRates() {
  const { data, isLoading, error } = useSWR(
    "getCurrencyRates",
    getCurrencyRates,
    {
      revalidateOnFocus: false,
      refreshInterval: 1800000, // 30 minutes
      dedupingInterval: 1800000,
    }
  );

  return {
    currencyRates: data,
    isLoading,
    error,
  };
}
