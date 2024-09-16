"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import useTokens from "@/lib/useTokens";

// async function getData(): Promise<TokenData[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       token: {
//         _id: new ObjectId("66cf9abae66f8f7cd8d28a86"),
//         id: "polkadot",
//         symbol: "dot",
//         name: "Polkadot",
//         image:
//           "https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png?1696512008",
//         current_price: 4.29,
//         price_change_percentage_24h: -1.50255,
//         price_change_24h: 0,
//         market_cap: 0,
//         market_cap_rank: 0,
//         circulating_supply: 0,
//         total_supply: 0,
//         max_supply: 0,
//         ath: 0,
//         ath_date: "",
//         atl: 0,
//         atl_date: "",
//         last_updated: "",
//       },
//       amount: 234,
//       last_updated: "2024-09-01T22:12:59.320Z",
//       _id: new ObjectId("66d4e6ebf829bd153d9cd206"),
//     },
//   ];
// }

export default function DemoPage() {
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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
