import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "CryptoVison - Dashboard",
  description: "CryptoVison - Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
