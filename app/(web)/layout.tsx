import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CryptoVision AI - Home",
  description: "Track your crypto portfolio with AI-powered insights",
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
}
