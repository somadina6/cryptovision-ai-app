"use client";

import { TokenData } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteToken, formatPrice } from "@/utils/apis/apis";
import toast from "react-hot-toast";
import { DeleteDialog } from "./delete-dialog";
import { useState } from "react";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import EditTokenAmountDialog from "@/components/Dialog/EditTokenAmountDialog";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<TokenData>[] = [
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "token.name",
    cell: ({ row, column }) => {
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
    cell: ({ row }) => {
      let price = row.original.token.current_price;
      const formattedPrice = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
        minimumFractionDigits: 2,
        minimumSignificantDigits: 2,
      }).format(price);

      return <div className="text-left font-medium">{formattedPrice}</div>;
    },
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-left px-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        24HR
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorKey: "token.price_change_percentage_24h",
    cell: ({ row }) => {
      const priceChange = row.original.token.price_change_percentage_24h;

      return (
        <div
          className={`text-left font-medium ${
            priceChange > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {priceChange > 0 ? "+" : ""}
          {priceChange.toFixed(2)}%
        </div>
      );
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const price = row.original.token.current_price;
      const amount = row.original.amount;
      const total = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price * amount);
      return <div className="text-left font-medium">{total}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const token = row.original.token;
      const amount = row.original.amount;

      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu
          open={open}
          onOpenChange={setOpen}
          key={token._id.toString()}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <EditTokenAmountDialog token={token} currentAmount={amount} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <DeleteDialog tokenId={token._id.toString()} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View {token.name} Page</DropdownMenuItem>
            <DropdownMenuItem>View on CoinGecko</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
