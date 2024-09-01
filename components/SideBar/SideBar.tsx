"use client";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Header/Logo";

type navType = {
  name: string;
  href: string;
};

const navLinks: navType[] = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
  },
  {
    name: "Tokens",
    href: "/app/tokens",
  },
  {
    name: "Explore",
    href: "/app/explore",
  },
];

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      id="sidebar"
      className="border-r border-border fixed top-0 z-20 left-0 min-h-screen bg-background flex flex-col gap-2 md:px-2 lg:px-5 md:py-6"
    >
      <div className="mb-12">
        <Logo />
      </div>
      {navLinks.map((navlink) => {
        const isActive = pathname?.startsWith(navlink.href);

        return (
          <div
            key={navlink.name}
            className={`navlink cursor-pointer px-2 py-1.5 rounded-md hover:bg-muted ${
              isActive ? "bg-muted" : ""
            }`}
            onClick={() => router.push(navlink.href)}
          >
            <p
              className={`font-semibold font-sans ${
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
