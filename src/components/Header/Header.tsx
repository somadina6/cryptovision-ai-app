"use client";
import React, { useContext, useState } from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import ButtonPrimary2 from "../Buttons/ButtonPrimary2";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeContext } from "@/context/themeContext";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "./Logo";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import SettingsMenu from "./SettingsMenu";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const { status, data: session } = useSession();

  return (
    <section className="h-16 flex px-4 md:px-12 py-4 items-center justify-between shadow-sm sticky top-0 z-50 bg-white dark:bg-slate-950">
      <Logo />

      {status === "unauthenticated" && (
        <div className="hidden md:flex gap-2 items-center">
          <ButtonPrimary href="/auth/login" text="Login" />
          <ButtonPrimary2 href="/auth/signup" text="Get Started for Free" />
        </div>
      )}
      {session && status === "authenticated" && (
        <div>
          <div className="md:hidden cursor-pointer text-lg">
            <GiHamburgerMenu
              onClick={() => setShowSettings((prev) => !prev)}
              className="text-primary "
            />
            {showSettings && <SettingsMenu setShowSettings={setShowSettings} />}
          </div>
          <div
            className="hidden md:flex items-center justify-center cursor-pointer h-6 hover:opacity-80 flex-col"
            onClick={() => setShowSettings((prev) => !prev)}
          >
            {session.user?.image ? (
              <div className="flex gap-2">
                <div className="rounded-xl overflow-hidden ">
                  <Image
                    src={session.user.image}
                    alt="User Image"
                    height={24}
                    width={24}
                  />
                </div>
                <p>{session.user.name?.split(" ")[0]}</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="rounded-xl overflow-hidden ">
                  <CgProfile size={24} className="text-primary" />{" "}
                </div>
                <p>{session.user.name?.split(" ")[0]}</p>
              </div>
            )}

            {showSettings && <SettingsMenu setShowSettings={setShowSettings} />}
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
