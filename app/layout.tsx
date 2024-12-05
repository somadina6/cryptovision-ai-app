import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoVision",
  description: "See your potential balance ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
