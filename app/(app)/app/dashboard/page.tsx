"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import TokenCard from "../../../../components/TokenCard/TokenCard";
import { formatPrice } from "../../../../utils/apis/apis";
import LoadUserData from "../../../../components/LoadUserData/LoadUserData";
import useTokens from "@/lib/useTokens";
import { setUserTokens } from "@/store/features/tokenSlice";

const Dashboard = () => {
  const { name, userId } = useAppSelector((state) => state.user);
  const { sum, change_24hr } = useAppSelector((state) => state.token);
  const firstName = name ? name.split(" ")[0] : "User";
  const sign = change_24hr > 0 ? "+" : "";

  const { tokens: userTokens, isLoading } = useTokens(userId ?? "");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center max-w-[600px] p-4 mx-auto my-8 bg-popover-background rounded-lg ">
        <h2 className="text-xl font-semibold ">Loading...</h2>
      </div>
    );
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold">Welcome, {firstName}!</h3>
        <h4 className="text-xl">
          Your portfolio is valued at {formatPrice(sum, "USD")}. It is{" "}
          {change_24hr > 0 ? "up" : "down"} by {sign}
          {change_24hr.toFixed(2)}% in the last 24 hours.
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTokens && userTokens.length > 0 ? (
          userTokens.map(({ token, _id, amount }) => (
            <TokenCard
              key={_id.toString()}
              token={token}
              amount={amount}
              _id={_id}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-lg">
            No tokens found in your portfolio.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
