import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; 
import Footer from './components/Footer'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stanford Optimism Voting",
  description: "Optimism Voting Strategy Research by Stanford Blockchain",
  icons: {
    icon: 'SBC.png'
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
        <Header /> 
        <main>
          {children}
        </main>
        <Footer /> 
      </body>
    </html>
  );
}
