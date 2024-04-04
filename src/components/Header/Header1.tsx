"use client";
import { ThemeContext } from "@/context/themeContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

const Header1 = () => {
  const router = useRouter();
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  return (
    <div className="flex px-4 md:px-8 py-4 items-center justify-between shadow-sm">
      <div
        id="logo"
        className="flex font-bold sm:text-sm md:text-lg items-center "
      >
        <p className={`dark:text-white`}>CryptoVision</p>
        <p className="ml-1 text-primary">AI</p>

        <div
          onClick={() => setDarkTheme(!darkTheme)}
          className="ml-2 cursor-pointer"
        >
          {darkTheme ? <FaMoon /> : <MdSunny />}
        </div>
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
