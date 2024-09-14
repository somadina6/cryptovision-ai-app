"use client";
import { ThemeContext } from "../../context/themeContext";
import { useEffect, useState } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [componentRendered, setComponentRendered] = useState<boolean>(false);

  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("crypto-theme")
      ? JSON.parse(localStorage.getItem("crypto-theme")!)
      : false;

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);

  useEffect(() => {
    setComponentRendered(true);
  }, []);

  if (!componentRendered) return <></>;

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div className={`${darkTheme ? "dark" : ""}  `}>
        <div className=" dark:text-white bg-background text-[#1e1e1e] ">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
