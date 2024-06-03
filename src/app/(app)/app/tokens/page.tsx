"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MutatingDots } from "react-loader-spinner";
import Balance from "@/components/Balance/Balance";
import Table from "@/components/Table/Table";
import { useAppSelector } from "@/store/hooks";

const Page = () => {
  // const { status } = useSession();

  const userId = useAppSelector((state) => state.user.userId);
  const status = useAppSelector((state) => state.user.status);

  if (status === "loading") {
    return (
      <div className="flex gap-2">
        <MutatingDots height="100" width="100" />
        <p>{status}...</p>
      </div>
    );
  }

  if (userId) {
    // console.log("USER ID:", userId);
    return (
      <div className="w-full ">
        <h2 className="text-3xl font-bold text-left text-primary mb-3">
          Tokens
        </h2>
        <section className="w-5/6 ">
          <div>
            <p className="text-sm text-gray-700 dark:text-white mb-2">
              This page displays a table of user tokens, including their name,
              symbol, real-time price, and amount.
            </p>
          </div>
        </section>

        <section className="sm:flex sm:flex-col-reverse md:grid grid-cols-12 gap-4">
          <div className="md:col-span-9 block">
            <Table userId={userId} />
          </div>

          <div className="md:col-span-3 ">
            <div className="sticky top-16">
              <Balance />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Handle other states or unauthenticated status

  return (
    <div>
      <p>You are not authenticated</p>
    </div>
  );
};

export default Page;
