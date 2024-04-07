"use client";
import React, { useContext } from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import ButtonPrimary2 from "../Buttons/ButtonPrimary2";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeContext } from "@/context/themeContext";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { useSession, signIn } from "next-auth/react";
import Logo from "./Logo";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { status } = useSession();
  return (
    <section className="h-16 flex px-4 md:px-8 py-4 items-center justify-between shadow-sm sticky top-0 z-50 bg-white dark:bg-slate-950">
      <Logo />

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
