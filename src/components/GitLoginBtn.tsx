"use client";

import { Github } from "lucide-react";
import { login } from "@/lib/auth/auth.action";

export default function GitLoginBtn() {
  return (
    <button
      onClick={() => login()}
      className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-violet-600 hover:text-white active:scale-[0.98] transition "
    >
      <Github className="w-5 h-5" />
      <span>Continue with GitHub</span>
    </button>
  );
}
