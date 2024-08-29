"use client";
import React from "react";
import { useAppSelector } from "../../../../store/hooks";
import TokenCard from "../../../../components/TokenCard/TokenCard";
import { formatPrice } from "../../../../utils/apis/apis";
import LoadUserData from "../../../../components/LoadUserData/LoadUserData";
import { TokenData } from "../../../../types/types";

const Dashboard = () => {
  const { name } = useAppSelector((state) => state.user);
  const { userTokens, sum, change_24hr } = useAppSelector(
    (state) => state.token
  );
  const firstName = name ? name.split(" ")[0] : "User";
  const sign = change_24hr > 0 ? "+" : "";

  return (
    <div className="p-8">
      <LoadUserData />
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
