import { TokenData, formatPrice } from "@/utils/apis/apis";
import React, { FC } from "react";
import useSWR, { mutate } from "swr";

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
    <div className="h-32 w-full border rounded-lg flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md">
      <div className="text-4xl font-bold">{formatPrice(sum)}</div>
      <button
        className="mt-4 px-6 py-2 bg-white text-blue-500 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => {
          mutate("updatePricesAndSaveToDB");
        }}
      >
        <svg
          className="w-6 h-6 mr-2 inline-block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h3l-1.5-2L4 6H1v4m13 4h-3l1.5 2L16 18h3v-4m-2-9a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        Refresh
      </button>
    </div>
  );
};

export default Balance;
