import { ThemeContext } from "@/context/themeContext";
import React, { useContext } from "react";
import ButtonPrimary from "../Buttons/ButtonPrimary";
import Header from "../Header/Header";

const HomePage = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  return <div></div>;
};

export default HomePage;
