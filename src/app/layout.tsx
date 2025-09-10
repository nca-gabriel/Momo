import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import AppProvider from "../context/AppProvider";
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
  title: "Momo",
  description: "Task Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen  `}
      >
        <AppProvider>
          <div className="flex min-h-screen w-full">
            <div className="flex w-full max-w-screen-2xl mx-auto gap-2">
              <Sidebar />
              <main className="flex-1 ">{children}</main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
