import { TokenData, formatPrice } from "@/utils/apis/apis";
import React, { FC } from "react";
import useSWR, { mutate } from "swr";
import { FiRefreshCw } from "react-icons/fi";

const Balance = () => {
  let {
    data: coinDetails,
    error: fetchingError,
    isLoading,
  } = useSWR<TokenData[]>("getUserTokens");
  let sum = 0;
  if (coinDetails) {
    coinDetails.forEach((coin) => {
      sum += coin.price * coin.amount;
    });
  }
  return (
    <div className="h-32 w-full rounded-lg flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md">
      <div className="text-4xl font-bold">{formatPrice(sum)}</div>
      <button
        className="mt-4 px-6 py-2 bg-white text-blue-500 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => {
          mutate("updatePricesAndSaveToDB");
        }}
      >
        <FiRefreshCw className="w-6 h-6 mr-2 inline-block" />
        Refresh
      </button>
    </div>
  );
};

export default Balance;
