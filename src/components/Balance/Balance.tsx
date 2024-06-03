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
  { code: "USD", label: "US Dollar" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "NGN", label: "Nigerian Naira" },
  { code: "EUR", label: "Euro" },
];

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<string>("");
  const [currency, setCurrency] = useState<string>(currencies[0].code);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sum = useAppSelector((state) => state.token.sum);

  useEffect(() => {
    const fetchConvertedBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const convertedBalance = await convertCurrency(sum, currency);
        if (convertedBalance) {
          setBalance(formatPrice(convertedBalance, currency));
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch conversion rate");
      } finally {
        setLoading(false);
      }
    };

    fetchConvertedBalance();
  }, [sum, currency]);

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(event.target.value);
  };

  return (
    <div className="balance-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="balance-value">{balance}</div>
      )}

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
        Refresh
      </button>
    </div>
  );
};

export default Balance;
