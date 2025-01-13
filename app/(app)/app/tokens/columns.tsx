"use client";

import { PortfolioWithToken } from "@/types/database";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "./delete-dialog";
import EditTokenAmountDialog from "@/components/Dialog/EditTokenAmountDialog";
import Image from "next/image";

export const columns: ColumnDef<PortfolioWithToken>[] = [
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
    enableHiding: false,
    cell: ({ row }) => {
      const token = row.original.token;

      return (
        <div>
          <Link
            className="flex items-center space-x-2"
            href={`/app/explore/${token.id}`}
          >
            <Image
              src={token.image}
              alt={token.name}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            <div>
              <div className="font-medium">{token.name}</div>
            </div>
          </Link>
        </div>
      );
    },
  },
  {
    header: () => <div className="text-left">Symbol</div>,
    accessorKey: "token.symbol",
    enableHiding: false,
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
    enableHiding: false,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return <div className="text-left font-medium">{amount}</div>;
    },
  },
  {
    header: "Price",
    accessorKey: "token.current_price",
    id: "Price",
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
    header: "ATH",
    accessorKey: "token.ath",
    id: "All Time High",
    enableHiding: true,
    cell: ({ row }) => {
      const ath = row.original.token.ath;
      const formattedAth = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
        minimumFractionDigits: 2,
        minimumSignificantDigits: 2,
      }).format(ath);

      return <div className="text-left font-medium">{formattedAth}</div>;
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
    enableHiding: true,
    id: "24HR",
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
    header: ({ column }) => (
      <p onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Portfolio %
      </p>
    ),
    id: "portfolio-percentage",
    enableHiding: true,
    enableSorting: true,
    cell: ({ row, table }) => {
      const price = row.original.token.current_price;
      const amount = row.original.amount;
      const rowTotalValue = price * amount;

      const portfolioTotalValue = table
        .getCoreRowModel()
        .rows.reduce(
          (total, r) =>
            total + r.original.token.current_price * r.original.amount,
          0
        );

      const percentage = (rowTotalValue / portfolioTotalValue) * 100;

      return (
        <div className="text-left font-medium">{percentage.toFixed(2)}%</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const portfolioItem = row.original;
      const amount = portfolioItem.amount;

      return (
        <DropdownMenu key={portfolioItem.token.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <EditTokenAmountDialog
                token={portfolioItem}
                currentAmount={amount}
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <DeleteDialog tokenId={portfolioItem.token.id} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/app/explore/${portfolioItem.token.id}`}>
                View {portfolioItem.token.name} Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View on CoinGecko</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
