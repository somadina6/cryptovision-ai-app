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
      className="flex flex-col md:flex-row font-bold text-sm md:text-lg items-center "
    >
      <div className="hidden md:flex gap-1 cursor-pointer">
        <p className="" onClick={() => router.push("/")}>
          CryptoVision
        </p>

        <p className="text-primary ">AI</p>
      </div>

      <div className="md:ml-2 cursor-pointer mt-2 md:mt-0 text-2xl">
        {darkTheme ? (
          <div
            onClick={() => {
              setDarkTheme(false);
              localStorage.removeItem("crypto-theme");
            }}
          >
            <FaMoon className="" />
          </div>
        ) : (
          <div
            onClick={() => {
              setDarkTheme(true);
              localStorage.setItem("crypto-theme", "true");
            }}
          >
            <MdSunny className="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
