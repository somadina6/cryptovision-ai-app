import { Dispatch, SetStateAction, createContext } from "react";

type ThemeContextType = {
  darkTheme: boolean;
  setDarkTheme: Dispatch<SetStateAction<boolean>>;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkTheme: false,
  setDarkTheme: () => null,
});
