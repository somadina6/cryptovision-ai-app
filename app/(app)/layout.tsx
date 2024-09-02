import type { Metadata } from "next";
import "../(web)/globals.css";
import ThemeProvider from "../../components/ThemeProvider/ThemeProvider";
import Header from "../../components/Header/Header";
import { NextAuthProvider } from "../../components/AuthProvider/AuthProvider";
import Toast from "../../components/Toast/Toast";
import SideBar from "../../components/SideBar/SideBar";
import { Poppins } from "next/font/google";
import UserProvider from "../../components/UserProvider/UserProvider";
import SessionExpiredModal from "../../components/SessionExpiredModal/SessionExpiredModal";
import ReduxProvider from "../../components/ReduxProvider/ReduxProvider";
import RightSection from "../../components/SideBar/RightSection";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CryptoVison - Dashboard",
  description: "CryptoVison - Dashboard",
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
                <main className="flex w-screen min-h-screen">
                  <SideBar />

                  <section
                    id="main"
                    className="mr-[220px] flex-grow px-2 md:px-4 py-2 md:py-3 w-full overflow-y-auto overflow-x-scroll "
                  >
                    {children}
                  </section>

                  <RightSection />

                  {/* <Footer /> */}
                </main>
              </ThemeProvider>
            </UserProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
