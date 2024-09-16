import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../../components/ThemeProvider/ThemeProvider";
import Header from "../../components/Header/Header";
import { NextAuthProvider } from "../../components/AuthProvider/AuthProvider";
import Toast from "../../components/Toast/Toast";
import { getServerSession } from "next-auth";
import ReduxProvider from "../../components/ReduxProvider/ReduxProvider";

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
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider>
              <Toast />
              <Header />
              {children}
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
