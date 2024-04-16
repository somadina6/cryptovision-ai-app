import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../(web)/globals.css";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import Header from "@/components/Header/Header";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import Toast from "@/components/Toast/Toast";
import SideBar from "@/components/SideBar/SideBar";
import { Poppins } from "next/font/google";
import { getServerSession } from "next-auth";
import UserProvider from "@/components/UserProvider/UserProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CryptoVision",
  description: "See your potential balance ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextAuthProvider session={session}>
          <UserProvider>
            <ThemeProvider>
              <Toast />
              <Header />
              <div className="w-screen flex">
                <SideBar />
                <div
                  id="mainbar"
                  className="rounded-md px-10 py-2 ml-3  w-full"
                >
                  {children}
                </div>
              </div>
            </ThemeProvider>
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
