"use client";
import { convertCurrency, formatPrice } from "@/utils/apis/apis"; // Adjust the import path as needed
import { mutate } from "swr";
import { FiRefreshCw } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import "./Balance.css"; // Import the CSS file

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
  const [balance, setBalance] = useState<string>("");
  const [balanceChange, setBalanceChange] = useState<string>("");
  const [currency, setCurrency] = useState<string>(currencies[0].code);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { sum, sum_change_24hr, change_24hr } = useAppSelector(
    (state) => state.token
  );

  useEffect(() => {
    const fetchConvertedBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const convertedBalance = await convertCurrency(sum, currency);
        const convertedBalanceChange = await convertCurrency(
          sum_change_24hr,
          currency
        );
        setBalance(formatPrice(convertedBalance, currency));
        setBalanceChange(formatPrice(convertedBalanceChange, currency));
      } catch (err) {
        console.log(err);
        setError("Failed to fetch conversion rate");
      } finally {
        setLoading(false);
      }
    };
    fetchConvertedBalance();
  }, [sum, currency, sum_change_24hr]);

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(event.target.value);
  };

  const getFontSizeClass = (balance: string) => {
    const length = balance.length;
    if (length > 10) return "balance-value-small";
    if (length > 7) return "balance-value-medium";
    return "balance-value-large";
  };

  const sign = change_24hr > 0 ? "+" : "";

  return (
    <div className="balance-container bg-primary">
      <div className="flex justify-between w-full">
        <select
          className="currency-dropdown"
          value={currency}
          onChange={handleCurrencyChange}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.label}
            </option>
          ))}
        </select>

        <button
          className="refresh-button"
          onClick={() => {
            mutate("updatePricesAndSaveToDB");
          }}
        >
          <FiRefreshCw className="refresh-icon" />
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className={`balance-value ${getFontSizeClass(balance)}`}>
          <span>{balance}</span>
          <p className={`block text-xs font-thin `}>
            {sign}
            {balanceChange}
            {"  "}({sign}
            {change_24hr.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default Balance;
