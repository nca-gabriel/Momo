"use client";

import axios from "axios";
import { signIn } from "next-auth/react";

interface Props {
  isSignup: boolean;
  name?: string;
  email: string;
  password: string;
}

export async function handleAuthAction({
  isSignup,
  name,
  email,
  password,
}: Props) {
  try {
    if (isSignup) {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      if (res.status !== 200)
        throw new Error(res.data?.error || "Signup failed");
    }

    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/user-info",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    throw new Error(message);
  }
}
