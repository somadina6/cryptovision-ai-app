"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTokens from "@/lib/useTokens";
import Balance from "@/components/Cards/Balance";
import TopCard from "@/components/Cards/TopCard";

export default function Page() {
  const { tokens: data, isLoading } = useTokens();

  if (isLoading || !data)
    return (
      <div>
        <div className="flex">
          <Skeleton className="w-full h-12" />
        </div>

        <div>
          <Skeleton className="w-full h-72 mt-4" />
          <Skeleton className="w-full h-40 mt-4" />
        </div>
      </div>
    );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex gap-10">
        <Balance />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
