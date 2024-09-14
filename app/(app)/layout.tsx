import type { Metadata } from "next";
import SideBar from "../../components/SideBar/SideBar";
import RightSection from "../../components/SideBar/RightSection";

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
  );
}
