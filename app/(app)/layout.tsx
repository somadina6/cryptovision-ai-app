import type { Metadata } from "next";
import SideBar from "../../components/SideBar/SideBar";
import RightSection from "../../components/SideBar/RightSection";
import Header from "@/components/Header/Header";
import ReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import Toast from "@/components/Toast/Toast";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";

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
        <main className="flex w-screen min-h-screen">
          <SideBar />

          <section
            id="main"
            className="mr-[220px] md:p-2 flex-grow px-2 md:px-4 py-2 md:py-3 w-full overflow-y-auto overflow-x-hidden "
          >
            {children}
          </section>

          <RightSection />

          {/* <Footer /> */}
        </main>
      </ThemeProvider>
    </ReduxProvider>
  );
}
