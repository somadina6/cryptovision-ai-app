import Header1 from "@/components/Header/Header1";
import "../(web)/globals.css";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import Toast from "@/components/Toast/Toast";

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
        <NextAuthProvider>
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
