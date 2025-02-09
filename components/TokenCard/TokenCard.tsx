import React, { FC } from "react";
import { formatPrice } from "../../utils/apis/apis";

import Image from "next/image";
import Link from "next/link";
import { Token } from "@/types/database";

interface TokenCardProps {
  token: Token;
  amount: number;
}

const TokenCard = ({ token, amount }: TokenCardProps) => {
  const { name, symbol, current_price, image, price_change_percentage_24h } =
    token;

  const totalValue = amount * current_price;
  const priceChangeClass =
    price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500";

  return (
    <Link
      href={`/app/explore/${token.token_id}`}
      className="relative border border-border py-2 px-3 md:p-4 rounded-lg shadow-md flex items-center"
    >
      <Image
        src={image}
        alt={name}
        className="w-6 h-6 md:w-12 md:h-12 mr-4 rounded-full"
        width={48}
        height={48}
      />
      <div>
        <h5 className="font-bold text-base md:text-lg">
          {symbol.toUpperCase()}
        </h5>
        <p className={`text-sm md:text-base ${priceChangeClass}`}>
          ${current_price}{" "}
          <span>
            ({price_change_percentage_24h > 0 ? "+" : ""}
            {price_change_percentage_24h.toFixed(2)}%)
          </span>
        </p>
      </div>
      <p className="absolute right-3 text-sm md:text-base font-bold">
        {formatPrice(totalValue, "USD", 1)}
      </p>
    </Link>
  );
};

export default TokenCard;
