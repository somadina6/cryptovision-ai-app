"use client";
import React, { useContext } from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import ButtonPrimary2 from "../Buttons/ButtonPrimary2";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeContext } from "@/context/themeContext";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { useSession, signIn } from "next-auth/react";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { status } = useSession();
  return (
    <section className="flex items-center justify-between py-4 md:px-10 px-4">
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

      <GiHamburgerMenu className="md:hidden cursor-pointer text-primary text-lg" />
      {status === "unauthenticated" && (
        <div className="hidden md:flex gap-2 items-center">
          <ButtonPrimary href="/auth/login" text="Login" />
          <ButtonPrimary2 href="/auth/signup" text="Get Started for Free" />
        </div>
      )}
    </section>
  );
};

export default Header;
