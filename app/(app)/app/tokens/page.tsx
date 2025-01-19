"use client";

import { Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAppSelector } from "@/store/hooks";
import {
  selectAllTokens,
  selectTokensStatus,
} from "@/store/features/tokenSlice";
import Balance from "@/components/Cards/Balance";
import TokenPortfolioAthCard from "@/components/Cards/AthCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceCard } from "@/components/Cards/TokenPerfomanceCards";
import PortfolioPieChart from "@/components/Cards/PortfolioPieChart";

// Separate loading state component
const TokenPageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex gap-10">
      <Skeleton className="flex-1 h-40" />
      <Skeleton className="flex-1 h-40" />
    </div>
    <Skeleton className="w-full h-[500px]" />
  </div>
);

// Tokens content component
const TokenPageContent = () => {
  const tokens = useAppSelector(selectAllTokens);
  const status = useAppSelector(selectTokensStatus);

  if (status === "loading" || !tokens) {
    return <TokenPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:flex gap-1 md:gap-4 flex-wrap">
        <Balance />
        <TokenPortfolioAthCard tokens={tokens} />
        <PerformanceCard tokens={tokens} type="gainers" />
        <PerformanceCard tokens={tokens} type="losers" />
      </div>
      <Card className="w-full">
        <DataTable columns={columns} data={tokens} />
      </Card>
      <PortfolioPieChart tokens={tokens} />
    </div>
  );
};

// Main page component with Suspense
export default function TokensPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<TokenPageSkeleton />}>
        <TokenPageContent />
      </Suspense>
    </div>
  );
}
