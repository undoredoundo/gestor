import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Gestor",
  description: "Gestor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
