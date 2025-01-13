import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import Toast from "@/components/Toast/Toast";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import SideBar from "@/components/SideBar/SideBar";

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
    <ReduxProvider>
      <ThemeProvider>
        <Toast />
        <Header />
        <main className="flex min-h-screen overflow-x-hidden">
          <SideBar />

          <section
            id="main"
            className="md:w-[calc(100%_-13rem)] w-[calc(100%_-_3.65rem)]
                          mr-0 md:p-2 flex-grow px-1 md:px-4 
                           py-2 overflow-x-scroll"
          >
            {children}
          </section>

          {/* <Footer /> */}
        </main>
      </ThemeProvider>
    </ReduxProvider>
  );
}
