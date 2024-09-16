"use client";
import { convertCurrency, formatPrice } from "../../utils/apis/apis"; // Adjust the import path as needed
import { mutate } from "swr";
import { FiRefreshCw } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
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
    if (length > 10) return "text-md";
    if (length > 8) return "text-lg";
    return "text-2xl";
  };

  const sign = change_24hr > 0 ? "+" : "";

  return (
    <div className="balance-container bg-card text-card-foreground p-4 rounded-lg shadow">
      <div className="flex justify-between w-full mb-4">
        <select
          className="currency-dropdown bg-input text-foreground rounded-lg p-2"
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
          className="refresh-button text-primary hover:text-primary-foreground p-2"
          onClick={() => {
            mutate("updatePricesAndSaveToDB");
          }}
        >
          <FiRefreshCw className="refresh-icon" />
        </button>
      </div>

      {loading ? (
        <div className="spinner text-muted-foreground"></div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <div className={`balance-value ${getFontSizeClass(balance)}`}>
          <span>{balance}</span>
          <p className="block text-xs font-thin text-muted-foreground">
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
