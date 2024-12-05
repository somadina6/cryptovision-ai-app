"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice } from "@/utils/apis/apis";
import { useAppSelector } from "@/store/hooks";
import useCurrencyRates from "@/lib/useCurrencyRates";

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

const BalanceCard: React.FC = () => {
  const [currency, setCurrency] = useState<string>(currencies[0].code);

  const { sum_change_24hr, change_24hr, userTokens } = useAppSelector(
    (state) => state.token
  );

  const sum = useMemo(
    () => 
      userTokens ? userTokens.reduce((sum, token) => sum + token.token.current_price * token.amount, 0) : 0,
    [userTokens]
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

  const sign = change_24hr > 0 ? "+" : "";

  return (
    <Card className="card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[70px] h-7 text-xs">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                {curr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {isLoading ? (
            <Skeleton className="w-full h-[40px] rounded-lg" />
          ) : error ? (
            <div className="text-destructive text-sm">{error}</div>
          ) : (
            <>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {convertedBalance}
                </p>
                <p className="text-xs text-muted-foreground">Current Balance</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="flex items-center">
                      {change_24hr > 0 ? (
                        <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="mr-2 h-4 w-4 text-destructive" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          change_24hr > 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {sign}
                        {convertedBalanceChange} ({sign}
                        {change_24hr.toFixed(2)}%)
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>24-hour balance change</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
