"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  TrendingUp,
  BarChart,
  DollarSign,
  ArrowUpRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddTokenDialog from "@/components/Dialog/Dialog";
import { FinancialMetrics } from "@/components/TokenMetrics/FinancialMetrics";
import TokenSentiment from "@/components/TokenSentiment/TokenSentiment";
import {
  getToken,
  getUserId,
  getUserPortfolio,
} from "@/utils/supabase/queries";
import { Token } from "@/types/database";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUserTokens,
  setLoading,
  setError as setTokenError,
} from "@/store/features/tokenSlice";

export default function TokenDetailPage({ tokenId }: { tokenId: string }) {
  const [token, setToken] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.token);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        // Prevent duplicate state updates if component is unmounted
        if (!isSubscribed) return;

        console.log("Fetching token data...");
        setIsLoading(true);
        dispatch(setLoading());

        console.log("Calling getToken with tokenId:", tokenId);
        const fetchedToken = await getToken(tokenId);

        console.log("Token data fetched");

        // Check if component is still mounted before updating state
        if (!isSubscribed) return;

        if (!fetchedToken) {
          throw new Error(`No token found for ID: ${tokenId}`);
        }

        setToken(fetchedToken);

        const userId = await getUserId();
        if (!isSubscribed) return;

        if (userId) {
          const portfolioData = await getUserPortfolio(userId);
          if (isSubscribed) {
            dispatch(setUserTokens(portfolioData));
          }
        } else {
          dispatch(setUserTokens([]));
        }
      } catch (err) {
        if (!isSubscribed) return;

        console.error("Error in fetchData:", err);
        const errorMessage =
          err instanceof Error
            ? `Failed to fetch data: ${err.message}`
            : "Failed to fetch data. Please try again.";
        setError(errorMessage);
        dispatch(setTokenError(errorMessage));
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [tokenId, dispatch]);

  const calculateReturnsToATH = (currentPrice: number, athPrice: number) => {
    const returnsToATH = athPrice / currentPrice;
    return {
      multiplier: Math.round(returnsToATH * 10) / 10,
      percentage: Math.round((returnsToATH - 1) * 100),
    };
  };

  const BackButton = () => (
    <Button variant="outline" onClick={() => router.back()} className="mb-4">
      <ChevronLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !token ) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        <Card>
          <CardContent className="p-6 flex justify-center items-center">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading token details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const returnsToATH = calculateReturnsToATH(token.current_price, token.ath);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <Button
          className="mr-3"
          variant="outline"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center space-x-4">
          <Image
            src={token.image}
            alt={token.name}
            className="w-6 h-6 md:w-12 md:h-12 rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h1 className="text-sm md:text-base font-bold">{token.name}</h1>
            <div className="text-sm md:text-base text-muted-foreground">
              {token.symbol.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <AddTokenDialog token={token} />
          <Button variant="outline" size="icon">
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3 md:p-4 flex justify-between items-center">
          <div className="flex-grow">
            <div className="text-sm md:text-base font-semibold">
              ${token.current_price}
            </div>
            <div
              className={`text-xs md:text-sm ${
                token.price_change_percentage_24h > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {token.price_change_percentage_24h > 0 ? "+" : ""}
              {token.price_change_percentage_24h.toFixed(2)}% (24h)
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm md:text-base flex items-center space-x-2 bg-accent p-2 rounded-md">
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-500">
                    {returnsToATH.multiplier}X to ATH
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Potential return if token reaches its All-Time High again
                  <br />
                  Requires {returnsToATH.percentage}% increase from current
                  price
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Sentiment Analysis Card */}
      <TokenSentiment tokenSymbol={token.symbol} />

      {/* Tabs Section */}
      <Tabs defaultValue="financials">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financials">
            <DollarSign className="mr-2 h-4 w-4" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="markets">
            <TrendingUp className="mr-2 h-4 w-4" />
            Markets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financials">
          <FinancialMetrics token={token} />
        </TabsContent>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Token Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">Market Cap</div>
                <div>${token.market_cap.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Market Cap Rank</div>
                <div>#{token.market_cap_rank}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Circulating Supply</div>
                <div>{token.circulating_supply.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Supply</div>
                <div>{token.total_supply.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">All-Time High</div>
                <div>
                  ${token.ath.toLocaleString()}
                  <span className="text-muted-foreground ml-2 text-sm">
                    {format(new Date(token.ath_date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">All-Time Low</div>
                <div>
                  ${token.atl.toLocaleString()}
                  <span className="text-muted-foreground ml-2 text-sm">
                    {format(new Date(token.atl_date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="markets">
          {/* ... existing markets content ... */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
