"use client";

import { TokenData } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<TokenData>[] = [
  {
    header: "Symbol",
    accessorKey: "token.symbol",
  },
  {
    header: "Name",
    accessorKey: "token.name",
  },
  {
    header: () => <div className="text-left">Amount</div>,
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    header: "Price",
    accessorKey: "token.current_price",
  },
  {
    header: "24h Change",
    accessorKey: "token.price_change_percentage_24h",
  },
];
