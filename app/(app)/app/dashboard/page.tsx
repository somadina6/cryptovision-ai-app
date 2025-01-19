"use client";
import { useAppSelector } from "@/store/hooks";
import TokenCard from "@/components/TokenCard/TokenCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceCard } from "@/components/Cards/TokenPerfomanceCards";
import BalanceCard from "@/components/Cards/Balance";
import TokenPortfolioAthCard from "@/components/Cards/AthCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import FearGreedIndexCard from "@/components/Cards/FearGreedIndexCard";
import PortfolioPieChart from "@/components/Cards/PortfolioPieChart";
import PortfolioAdvisor from "@/components/AI/PortfolioAdvisor";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {
  const { name } = useAppSelector((state) => state.user);
  const { userTokens, status, error } = useAppSelector((state) => state.token);
  const firstName = name ? name.split(" ")[0] : "User";

  if (status === "loading") {
    return (
      <div className="p-8">
        <Skeleton className="h-20 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-96 w-full mt-8" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8 container px-2 md:px-4">
      {/* Welcome Section */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Welcome, {firstName}!</h3>
            <p className="text-muted-foreground">
              {userTokens?.length
                ? "Here's an overview of your crypto portfolio"
                : "Start building your crypto portfolio today"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <FearGreedIndexCard />
          </div>
        </div>
      </div>

      {!userTokens?.length ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Get Started with CryptoVision
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Track your cryptocurrency investments, analyze market trends, and
              get AI-powered insights to make informed decisions.
            </p>
            <Button asChild className="mt-4">
              <Link href="/app/explore" className="flex items-center gap-2">
                Explore Cryptocurrencies <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <PortfolioAdvisor />

          {/* Tighter grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BalanceCard />
            <TokenPortfolioAthCard tokens={userTokens} />
            <PerformanceCard tokens={userTokens} type="gainers" />
            <PerformanceCard tokens={userTokens} type="losers" />
          </div>

          <PortfolioPieChart tokens={userTokens} />
        </>
      )}

      {/* Token Holdings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Wallet className="mr-2 h-4 w-4" /> Your Token Holdings
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Tokens: {userTokens?.length || 0}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {userTokens && userTokens.length > 0 ? (
              userTokens.map(({ token, amount }) => (
                <TokenCard key={token.id} token={token} amount={amount} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-lg text-muted-foreground mb-4">
                  Your portfolio is empty. Start by adding some
                  cryptocurrencies!
                </p>
                <Button asChild variant="outline">
                  <Link href="/app/explore" className="flex items-center gap-2">
                    Browse Cryptocurrencies <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
