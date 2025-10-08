"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>; // prevent hydration mismatch

  const authPages = ["/login"];
  const isAuthPage = authPages.includes(pathname);

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full max-w-screen-2xl mx-auto gap-2">
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 p-4">{children}</main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#fff", color: "#1f2937" },
        }}
      />
    </div>
  );
}
