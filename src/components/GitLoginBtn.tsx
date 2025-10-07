"use client";

import { login } from "@/lib/auth/auth.action";

export default function GitLoginBtn() {
  return (
    <button onClick={() => login()} className="bg-gray-200">
      Sign In - Github
    </button>
  );
}
