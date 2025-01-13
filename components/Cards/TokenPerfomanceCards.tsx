import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PortfolioWithToken } from "@/types/database";
import Link from "next/link";

interface PerformanceCardProps {
  tokens: PortfolioWithToken[];
  type: "gainers" | "losers";
  limit?: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  tokens,
  type,
  limit = 3,
}) => {
  // Sort tokens based on performance
  const sortedTokens = [...tokens]
    .sort((a, b) =>
      type === "gainers"
        ? b.token.price_change_percentage_24h -
          a.token.price_change_percentage_24h
        : a.token.price_change_percentage_24h -
          b.token.price_change_percentage_24h
    )
    .slice(0, limit);

  return (
    <Card className="flex-1 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {type === "gainers" ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
          <CardTitle className="text-sm font-medium">
            Top {type === "gainers" ? "Gainers" : "Losers"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTokens.map((portfolio, index) => (
            <Link
              key={portfolio.token.id}
              href={`/app/explore/${portfolio.token.token_id}`}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4">
                  {index + 1}
                </span>
                <div className="relative">
                  <Image
                    src={portfolio.token.image}
                    alt={portfolio.token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {type === "gainers" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 absolute -bottom-1 -right-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive absolute -bottom-1 -right-1" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {portfolio.token.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {portfolio.token.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className={`text-sm font-semibold ${
                          type === "gainers"
                            ? "text-green-600 dark:text-green-500"
                            : "text-destructive"
                        }`}
                      >
                        {type === "gainers" ? "+" : ""}
                        {portfolio.token.price_change_percentage_24h.toFixed(2)}
                        %
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>24h Price Change</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Companion component to render both cards side by side
export const TokenPerformanceCards: React.FC<{
  tokens: PortfolioWithToken[];
}> = ({ tokens }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PerformanceCard tokens={tokens} type="gainers" />
      <PerformanceCard tokens={tokens} type="losers" />
    </div>
  );
};

export default TokenPerformanceCards;
