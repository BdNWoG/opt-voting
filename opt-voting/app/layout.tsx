import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";  // Import the Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Optimal Voting",
  description: "Optimism Voting Strategy Research by Stanford Blockchain",
  icons: {
    icon: 'SBC.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />  {/* Include the Header component here */}
        {children}
      </body>
    </html>
  );
}
