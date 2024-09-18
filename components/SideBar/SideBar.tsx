"use client";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Header/Logo";
import { MdDashboard, MdExplore, MdGeneratingTokens } from "react-icons/md";

type navType = {
  name: string;
  href: string;
  logo: JSX.Element;
};

const navLinks: navType[] = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
    logo: <MdDashboard />,
  },
  {
    name: "Tokens",
    href: "/app/tokens",
    logo: <MdGeneratingTokens />,
  },
  {
    name: "Explore",
    href: "/app/explore",
    logo: <MdExplore />,
  },
];

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div id="sidebar">
      <div className="mb-12">
        <Logo />
      </div>
      {navLinks.map((navlink) => {
        const isActive = pathname?.startsWith(navlink.href);

        return (
          <div
            key={navlink.name}
            className={`navlink cursor-pointer px-1 md:px-2 py-1.5 rounded-md hover:bg-muted flex items-center text-lg ${
              isActive ? "bg-muted" : ""
            }`}
            onClick={() => router.push(navlink.href)}
          >
            <div
              className={`mr-2 text-3xl md:text-lg ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {navlink.logo}
            </div>
            <p
              className={`font-semibold font-sans hidden md:block ${
                isActive ? "text-primary" : "text-muted-foreground"
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
