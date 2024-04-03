"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Header1 = () => {
  const router = useRouter();
  return (
    <div className="flex px-8 py-3 items-center justify-between shadow-sm bg-white">
      <div
        id="logo"
        className="flex font-bold sm:text-sm md:text-lg items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <p className={`dark:text-white`}>CryptoVision</p>
        <p className="ml-1 text-primary">AI</p>
      </div>
      <div
        className="text-primary text-sm cursor-pointer hover:opacity-90"
        onClick={() => router.push("/")}
      >
        Go back to CryptoVision
      </div>
    </div>
  );
};

export default Header1;
