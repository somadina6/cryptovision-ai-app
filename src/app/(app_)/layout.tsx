import Header1 from "@/components/Header/Header1";
import "../(web)/globals.css";

export const metadata = {
  title: "Login To CryptoVision AI",
  description: "Login To CryptoVision AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header1 />
        {children}
      </body>
    </html>
  );
}
