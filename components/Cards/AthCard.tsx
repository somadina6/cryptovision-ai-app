import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import useCurrencyRates from "@/lib/useCurrencyRates";
import { formatPrice } from "@/utils/apis/apis";
import { PortfolioWithToken } from "@/types/database";

interface TokenPortfolioAthCardProps {
  tokens: PortfolioWithToken[];
}

const TokenPortfolioAthCard = ({ tokens }: TokenPortfolioAthCardProps) => {
  const { preferred_currency: currency } = useAppSelector(
    (state) => state.user
  );
  const { currencyRates } = useCurrencyRates();

  const currentTotalValue = tokens.reduce(
    (sum, portfolio) => sum + portfolio.token.current_price * portfolio.amount,
    0
  );

  const athTotalValue = tokens.reduce(
    (sum, portfolio) => sum + portfolio.token.ath * portfolio.amount,
    0
  );

  const potentialGain = athTotalValue - currentTotalValue;
  const gainPercentage =
    currentTotalValue > 0 ? (athTotalValue / currentTotalValue - 1) * 100 : 0;

  const { convertedBalance, convertedBalanceChange } = useMemo(() => {
    if (currencyRates) {
      const rate = currencyRates[currency.code.toLowerCase()];
      const convertedBalance = formatPrice(athTotalValue, currency.code, rate);
      const convertedBalanceChange = formatPrice(
        potentialGain,
        currency.code,
        rate
      );

      return { convertedBalance, convertedBalanceChange };
    }
    return { convertedBalance: "", convertedBalanceChange: "" };
  }, [currency, potentialGain, athTotalValue, currencyRates]);

  const progressPercentage =
    athTotalValue > 0
      ? Math.min((currentTotalValue / athTotalValue) * 100, 100)
      : 0;

  return (
    <Card className="card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Portfolio ATH Value
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {convertedBalance}
            </p>
            <p className="text-xs text-muted-foreground">
              All-Time High Potential
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +{convertedBalanceChange} ({gainPercentage.toFixed(2)}%)
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Potential value if all tokens reached their All-Time High</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {progressPercentage.toFixed(2)}% of ATH Value
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPortfolioAthCard;
