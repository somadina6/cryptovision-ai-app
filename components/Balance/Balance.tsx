"use client";
import { formatPrice } from "../../utils/apis/apis"; // Adjust the import path as needed
import { useAppSelector } from "../../store/hooks";
import { useMemo, useState } from "react";
import "./Balance.css"; // Import the CSS file
import useCurrencyRates from "@/lib/useCurrencyRates";
import { Skeleton } from "../ui/skeleton";

interface Currency {
  code: string;
  label: string;
}

const currencies: Currency[] = [
  { code: "USD", label: "USD" },
  { code: "CAD", label: "CAD" },
  { code: "GBP", label: "GBP" },
  { code: "NGN", label: "NGN" },
  { code: "EUR", label: "EUR" },
];

const Balance: React.FC = () => {
  const [currency, setCurrency] = useState<string>(currencies[0].code);

  const { sum, sum_change_24hr, change_24hr } = useAppSelector(
    (state) => state.token
  );

  // Fetch the currency rates ex: USD, EUR, GBP
  const { currencyRates, error, isLoading } = useCurrencyRates();

  const { convertedBalance, convertedBalanceChange } = useMemo(() => {
    if (currencyRates) {
      const rate = currencyRates[currency.toLowerCase()];
      const convertedBalance = formatPrice(sum, currency, rate);
      const convertedBalanceChange = formatPrice(
        sum_change_24hr,
        currency,
        rate
      );
      return { convertedBalance, convertedBalanceChange };
    }
    return { convertedBalance: "", convertedBalanceChange: "" };
  }, [currency, sum, sum_change_24hr, currencyRates]);

  const getFontSizeClass = (balance: string) => {
    const length = balance.length;
    if (length > 10) return "text-md";
    if (length > 8) return "text-lg";
    return "text-2xl";
  };

  const sign = change_24hr > 0 ? "+" : "";

  return (
    <div className="balance-container bg-card text-card-foreground p-4 rounded-lg shadow">
      <select
        className="currency-dropdown bg-input text-foreground rounded-lg p-2"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.label}
          </option>
        ))}
      </select>

      {isLoading ? (
        <Skeleton className="w-full h-4 rounded-sm" />
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <div className={`balance-value ${getFontSizeClass(convertedBalance)}`}>
          <span>{convertedBalance}</span>
          <p className="block text-xs font-thin text-muted-foreground">
            {sign}
            {convertedBalanceChange}
            {"  "}({sign}
            {change_24hr.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default Balance;
