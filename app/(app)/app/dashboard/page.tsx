"use client";
import { useAppSelector } from "../../../../store/hooks";
import TokenCard from "../../../../components/TokenCard/TokenCard";
import useTokens from "@/lib/useTokens";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceCard } from "@/components/Cards/TokenPerfomanceCards";
import BalanceCard from "@/components/Cards/Balance";
import TokenPortfolioAthCard from "@/components/Cards/AthCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import FearGreedIndexCard from "@/components/Cards/FearGreedIndexCard";
import PortfolioPieChart from "@/components/Cards/PortfolioPieChart";
import PortfolioAdvisor from "@/components/AI/PortfolioAdvisor";
import { usePortfolio } from "@/lib/hooks/usePortfolio";

const Dashboard = () => {
  const { name } = useAppSelector((state) => state.user);
  const firstName = name ? name.split(" ")[0] : "User";

  const { portfolio: userTokens, isLoading, error } = usePortfolio();

  if (isLoading) {
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
    return <div>Error: {error.message}</div>;
  }

  if (!userTokens) {
    return <div>No tokens found</div>;
  }

  return (
    <div className="space-y-8 container px-2 md:px-4">
      {/* Welcome Section */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-2xl font-bold">Welcome, {firstName}!</h3>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your crypto portfolio
            </p>
          </div>
        </div>
      </div>

      <PortfolioAdvisor />

      {/* Tighter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BalanceCard />
        <TokenPortfolioAthCard tokens={userTokens} />
        <PerformanceCard tokens={userTokens} type="gainers" />
        <PerformanceCard tokens={userTokens} type="losers" />
        <FearGreedIndexCard />
      </div>

      <PortfolioPieChart tokens={userTokens} />

      {/* Token Holdings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Wallet className="mr-2 h-4 w-4" /> Your Token Holdings
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Total Tokens: {userTokens.length}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {userTokens && userTokens.length > 0 ? (
              userTokens.map(({ token, amount }) => (
                <TokenCard key={token.id} token={token} amount={amount} />
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-muted-foreground">
                No tokens found in your portfolio.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
