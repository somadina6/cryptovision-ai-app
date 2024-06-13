import React from "react";
import { formatPrice } from "@/utils/apis/apis";
import { TokenData } from "@/types/types";
import Image from "next/image";

type TokenCardProps = {
  token: TokenData;
};

const TokenCard = ({ token }: TokenCardProps) => {
  const { name, symbol, amount, price, image, price_change_percentage_24h } =
    token;

  const totalValue = amount * price;
  const priceChangeClass =
    price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="border p-4 rounded-lg shadow-md flex items-center">
      <Image src={image ?? ""} alt={name} className="w-12 h-12 mr-4" />
      <div>
        <h5 className="font-bold text-lg">
          {name} ({symbol.toUpperCase()})
        </h5>
        <p>Amount: {amount}</p>
        <p>Current Price: {formatPrice(price, "USD")}</p>
        <p>Total Value: {formatPrice(totalValue, "USD")}</p>
        <p className={priceChangeClass}>
          24h Change: {price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default TokenCard;
