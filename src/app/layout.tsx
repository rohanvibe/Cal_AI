import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cal AI | Your Fitness Assistant",
  description: "Professional-grade AI fitness, nutrition, and workout assistant.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
  themeColor: "#00f2ff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cal AI",
  },
};

import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main className="pwa-container">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
