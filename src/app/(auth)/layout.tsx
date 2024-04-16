import Header1 from "@/components/Header/Header1";
import "../(web)/globals.css";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import Toast from "@/components/Toast/Toast";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "CryptoVision AI",
  description: "View Your Potential Balance",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className="">
        <NextAuthProvider session={session}>
          <ThemeProvider>
            <Toast />
            <Header1 />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
