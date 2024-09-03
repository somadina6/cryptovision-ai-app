"ucse client";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { ThemeContext } from "../../context/themeContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const router = useRouter();
  return (
    <div
      id="logo"
      className="flex font-bold sm:text-sm md:text-lg items-center "
    >
      <p
        className={`dark:text-white cursor-pointer`}
        onClick={() => router.push("/")}
      >
        CryptoVision
      </p>
      <p className="ml-1 text-primary">AI</p>

      <div className="ml-2 cursor-pointer">
        {darkTheme ? (
          <div
            onClick={() => {
              setDarkTheme(false);
              localStorage.removeItem("crypto-theme");
            }}
          >
            <FaMoon />
          </div>
        ) : (
          <div
            onClick={() => {
              setDarkTheme(true);
              localStorage.setItem("crypto-theme", "true");
            }}
          >
            <MdSunny />
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
