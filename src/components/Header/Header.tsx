"use client";
import React, { useContext, useRef, useState } from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import ButtonPrimary2 from "../Buttons/ButtonPrimary2";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeContext } from "@/context/themeContext";
import Logo from "./Logo";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import SettingsMenu from "./SettingsMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hooks";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const userRef = useRef<HTMLDivElement>(null);

  const name = useAppSelector((state) => state.user.name);
  const status = useAppSelector((state) => state.user.status);
  const image = useAppSelector((state) => state.user.image);

  return (
    <section className="h-16 flex px-4 md:px-12 py-4 items-center justify-between shadow-sm sticky top-0 z-50 bg-white dark:bg-slate-950">
      <Logo />

      {status === "unauthenticated" && (
        <div className="hidden md:flex gap-2 items-center">
          <ButtonPrimary href="/auth/login" text="Login" />
          <ButtonPrimary2 href="/auth/signup" text="Get Started for Free" />
        </div>
      )}
      {status === "authenticated" && (
        <div>
          {/* Mobile  */}
          <div className="md:hidden cursor-pointer text-lg">
            <GiHamburgerMenu
              onClick={() => setShowSettings((prev) => !prev)}
              className="text-primary "
            />
            {showSettings && (
              <SettingsMenu
                setShowSettings={setShowSettings}
                userRef={userRef}
              />
            )}
          </div>

          {/* Desktop  */}
          <div
            ref={userRef}
            className="hidden md:flex items-center justify-center cursor-pointer h-6 hover:opacity-80 flex-col"
            onClick={() => setShowSettings((prev) => !prev)}
          >
            {image ? (
              <div className="flex gap-2">
                <div className="rounded-xl overflow-hidden ">
                  <Image src={image} alt="User Image" height={24} width={24} />
                </div>
                <p>{name?.split(" ")[0]}</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="rounded-xl overflow-hidden ">
                  <CgProfile size={24} className="text-primary" />{" "}
                </div>
                <p>{name?.split(" ")[0]}</p>
              </div>
            )}

            {/* Settings Modal  */}
            {showSettings && (
              <SettingsMenu
                setShowSettings={setShowSettings}
                userRef={userRef}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
