import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { TokenData } from "@/types/types";
import Link from "next/link";

interface PerformanceCardProps {
  tokens: TokenData[];
  type: 'gainers' | 'losers';
  limit?: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ 
  tokens, 
  type, 
  limit = 3
}) => {
  // Sort tokens based on performance
  const sortedTokens = [...tokens]
    .sort((a, b) => 
      type === 'gainers' 
        ? b.token.price_change_percentage_24h - a.token.price_change_percentage_24h
        : a.token.price_change_percentage_24h - b.token.price_change_percentage_24h
    )
    .slice(0, limit);

  return (
    <Card className="card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Top {type === 'gainers' ? 'Gainers' : 'Losers'}
        </CardTitle>
        {type === 'gainers' ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedTokens.map((tokenData) => (
            <div 
              key={tokenData.token._id.toString()} 
              className="flex items-center justify-between"
            >
              <Link
                href={`/app/explore/${tokenData.token.id}`}
               className="flex items-center space-x-2">
                <Image 
                  src={tokenData.token.image} 
                  alt={tokenData.token.symbol} 
                  width={24} 
                  height={24} 
                  className="rounded-full"
                />
                <span className="text-sm font-medium">
                  {tokenData.token.symbol.toUpperCase()}
                </span>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span 
                      className={`text-sm font-semibold ${
                        type === 'gainers' 
                          ? 'text-green-600' 
                          : 'text-destructive'
                      }`}
                    >
                      {type === 'gainers' ? '+' : ''}
                      {tokenData.token.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>24h Price Change</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Companion component to render both cards side by side
export const TokenPerformanceCards: React.FC<{ tokens: TokenData[] }> = ({ tokens }) => {
  return (
    <div className="flex space-x-4">
      <PerformanceCard tokens={tokens} type="gainers" />
      <PerformanceCard tokens={tokens} type="losers" />
    </div>
  );
};

export default TokenPerformanceCards;