"use client";
import { formatPrice } from "../../utils/apis/apis"; // Adjust the import path as needed
import { Skeleton } from "../ui/skeleton";

interface TokenData {
  name: string;
  price: number;
  price_change_percentage_24h: number;
}

interface CardProps {
  token: TokenData | null;
  isLoading: boolean;
  error: string | null;
  type: "gainer" | "loser";
}

const TopCard: React.FC<CardProps> = ({ token, isLoading, error, type }) => {
  return (
    <div className="w-[200px] h-[110px] bg-card p-4 rounded-lg shadow overflow-hidden">
      <h3 className="text-left ">
        {type === "gainer" ? "Top Gainer" : "Top Looser"}
      </h3>
      {isLoading ? (
        <Skeleton className="w-full h-full rounded-sm" />
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <div className="font-bold flex flex-col items-center gap-1">
          <span className="text-lg">{token?.name}</span>
          <p className="block text-xs text-green-500 font-bold">
            +{token?.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TopCard;
