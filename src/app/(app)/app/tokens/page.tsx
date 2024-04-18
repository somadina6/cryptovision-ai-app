"use client";
import Balance from "@/components/Balance/Balance";
import Table from "@/components/Table/Table";
import { TokenData, addToken, getTokens } from "@/utils/apis/apis";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR from "swr";

const Page = () => {
  const { data: session } = useSession();
  if (session) {
    console.log(session);
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

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-9 ">
            <Table />
          </div>

          <div className="col-span-3 ">
            <Balance />
          </div>
        </section>
      </div>
    );
  }
};

export default Page;
