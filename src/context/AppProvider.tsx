"use client";

import dynamic from "next/dynamic";

const AppContext = dynamic(() => import("./AppContext"), {
  ssr: false,
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContext>{children}</AppContext>;
}
