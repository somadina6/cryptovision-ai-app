"use client";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const Header1 = () => {
  const router = useRouter();

  return (
    <div className="flex px-4 md:px-8 py-4 items-center justify-between shadow-sm sticky top-0 z-50 bg-white dark:bg-slate-950">
      <Logo />

      <div
        className="text-primary text-sm cursor-pointer hover:opacity-90"
        onClick={() => router.push("/")}
      >
        Go back to CryptoVision
      </div>
    </div>
  );
};

export default Header1;
