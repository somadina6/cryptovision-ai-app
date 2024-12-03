"use client";
import { useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import Logo from "../Header/Logo";
import { MdDashboard, MdExplore, MdGeneratingTokens, MdMenu, MdClose } from "react-icons/md";

type NavLink = {
  name: string;
  href: string;
  logo: JSX.Element;
};

const navLinks: NavLink[] = [
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const NavItem = ({ navlink, isActive }: { navlink: NavLink, isActive: boolean }) => (
    <div
      className={`
        navlink 
        cursor-pointer 
        px-3 
        py-2.5 
        rounded-md 
        hover:bg-muted 
        flex 
        items-center 
        text-base 
        w-full 
        ${isActive ? "bg-muted" : ""}
      `}
      onClick={() => handleNavigation(navlink.href)}
    >
      <div
        className={`
          mr-3 
          text-2xl 
          ${isActive ? "text-primary" : "text-muted-foreground"}
        `}
      >
        {navlink.logo}
      </div>
      <p
        className={`
          font-semibold 
          font-sans 
          ${isActive ? "text-primary" : "text-muted-foreground"}
        `}
      >
        {navlink.name}
      </p>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-background p-2 rounded-md shadow-md"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
      </button>

      {/* Sidebar for Desktop */}
      <div 
        id="sidebar-desktop" 
        className="hidden md:flex flex-col fixed top-0 left-0 min-h-screen bg-background border-r border-border z-20 w-52 px-4 py-6 transition-all"
      >
        <div className="mb-8">
          <Logo />
        </div>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((navlink) => (
            <NavItem 
              key={navlink.name} 
              navlink={navlink} 
              isActive={pathname ? pathname.startsWith(navlink.href) : false}
            />
          ))}
        </nav>
      </div>

      {/* Mobile Overlay Menu */}
      <div 
        className={`
          md:hidden 
          fixed 
          inset-0 
          bg-background 
          z-40 
          transform 
          transition-transform 
          duration-300 
          ease-in-out 
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 pt-20 space-y-4">
          <div className="absolute top-4 left-4">
            <Logo />
          </div>
          <nav className="space-y-3">
            {navLinks.map((navlink) => (
              <NavItem 
                key={navlink.name} 
                navlink={navlink} 
                isActive={pathname ? pathname.startsWith(navlink.href) : false} 
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;