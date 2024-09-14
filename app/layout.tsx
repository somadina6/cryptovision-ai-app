import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header/Header";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import Toast from "@/components/Toast/Toast";
import UserProvider from "@/components/UserProvider/UserProvider";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "700", "900"],
//   style: ["italic", "normal"],
//   variable: "--font-poppins",
// });

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
      <body className={inter.className}>
        <NextAuthProvider>
          <ReduxProvider>
            <UserProvider>
              <ThemeProvider>
                <Toast />
                <Header />
                {children}
              </ThemeProvider>
            </UserProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
