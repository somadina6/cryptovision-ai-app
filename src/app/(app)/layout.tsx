import type { Metadata } from "next";
import "../(web)/globals.css";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import Header from "@/components/Header/Header";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import Toast from "@/components/Toast/Toast";
import SideBar from "@/components/SideBar/SideBar";
import { Poppins } from "next/font/google";
import UserProvider from "@/components/UserProvider/UserProvider";
import SessionExpiredModal from "@/components/SessionExpiredModal/SessionExpiredModal";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <NextAuthProvider>
          <ReduxProvider>
            <UserProvider>
              <ThemeProvider>
                <Toast />
                <Header />
                <div className="sm:w-4/5 md:w-screen flex">
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
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
