import type { Metadata } from "next";
import { Chango, Geist, Geist_Mono } from "next/font/google";
import ImageProtection from "@/components/ImageProtection";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const coiny = Chango({
  variable: "--font-coiny",
  subsets: ["latin"],
  weight: ["400"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekke Bar",
  description: "Ta det lugnt med en öl på Ekke Bar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${coiny.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ImageProtection />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
