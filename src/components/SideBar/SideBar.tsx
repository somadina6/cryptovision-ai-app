"use client";
import { useState } from "react";
import "./styles.scss";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Tokens",
    href: "/dashboard/tokens",
  },
];

const SideBar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState();
  const router = useRouter();
  return (
    <div
      id="sidebar"
      className=" border-r-2 flex flex-col gap-2 pl-6 py-6 sticky top-0 left-0"
    >
      {navLinks.map((navlink) => {
        return (
          <div
            className={`navlink cursor-pointer px-2 py-1.5 rounded-l-md text-opacity-80 hover:bg-[#d6d0d0] hover:dark:bg-primary  ${
              pathname == navlink.href ? "bg-[#d6d0d0] dark:bg-primary" : ""
            }`}
            onClick={() => router.push(navlink.href)}
          >
            <p
              className={`dark:text-white font-semibold font-sans ${
                pathname == navlink.href ? "text-primary" : "text-[#737070]"
              }`}
            >
              {navlink.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
