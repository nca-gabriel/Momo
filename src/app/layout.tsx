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
    <html lang="en" className="min-h-screen bg-gray-100">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen-2xl mx-auto w-full flex `}
      >
        <AppProvider>
          <Sidebar />
          <main className="ml-4 flex flex-1 flex-col py-4 max-sm:ml-0 max-sm:px-12">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
