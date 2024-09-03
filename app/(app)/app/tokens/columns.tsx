"use client";

import { TokenData } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteToken } from "@/utils/apis/apis";
import toast from "react-hot-toast";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<TokenData>[] = [
  {
    header: "Name",
    accessorKey: "token.name",
    cell: ({ row }) => {
      const token = row.original.token;

      return (
        <div className="flex items-center space-x-2">
          <img
            src={token.image}
            alt={token.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{token.name}</div>
          </div>
        </div>
      );
    },
  },
  {
    header: () => <div className="text-left">Symbol</div>,
    accessorKey: "token.symbol",
    cell: ({ row }) => {
      const token = row.original.token;

      return (
        <div className="text-left font-medium">
          {token.symbol.toUpperCase()}
        </div>
      );
    },
  },
  {
    header: () => <div className="text-left">Amount</div>,
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return <div className="text-left font-medium">{amount}</div>;
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
  {
    id: "actions",
    cell: ({ row }) => {
      const token = row.original.token;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View {token.name} Page</DropdownMenuItem>
            <DropdownMenuItem>View on CoinGecko</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await deleteToken(token._id.toString());
                toast.success("Token deleted successfully");
              }}
            >
              <p className="text-red-500 hover:text-red-600">Delete</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
