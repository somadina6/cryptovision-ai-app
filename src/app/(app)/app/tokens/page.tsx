"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MutatingDots } from "react-loader-spinner";
import Balance from "@/components/Balance/Balance";
import Table from "@/components/Table/Table";

const Page = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null); // State to hold userId

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id); // Set userId from session
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <>
        <MutatingDots height="100" width="100" />
        <p>{status}...</p>
      </>
    );
  }

  if (status === "authenticated" && userId) {
    console.log("USER ID:", userId);
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
            <Table id={userId} />
          </div>

          <div className="md:col-span-3 ">
            <Balance />
          </div>
        </section>
      </div>
    );
  }

  // Handle other states or unauthenticated status
  console.log(session);
  return (
    <div>
      <p>You are not authenticated</p>
    </div>
  );
};

export default Page;
