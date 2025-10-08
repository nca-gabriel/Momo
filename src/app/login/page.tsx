"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import GitLoginBtn from "@/components/GitLoginBtn";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { handleAuthAction } from "./actions";
import Image from "next/image";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get("/api/auth/session");
        setHasSession(!!data?.user);
      } catch (error) {
        setHasSession(false);
      }
    };
    checkSession();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await handleAuthAction({ isSignup: isSignUp, name, email, password });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error");
    }
  };

  return (
    <div className="flex min-h-[95vh] w-full items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto overflow-hidden  rounded-3xl shadow-2xl">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-12 text-white">
          {/* Branding */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Momo</h1>
            <p className="mt-2 text-base opacity-90">
              Elevate your productivity, securely and beautifully.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center items-center flex-grow py-8">
            <Image
              src="/cat.svg"
              alt="Login Illustration"
              width={600}
              height={600}
              className="w-11/12 h-auto drop-shadow-2xl translate-y-2"
              priority
            />
          </div>

          {/* Optional Footer */}
          <p className="text-xs text-center opacity-70">
            &copy; {new Date().getFullYear()} Momo. All rights reserved.
          </p>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 min-h-full px-8 py-12 sm:px-14">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              {isSignUp
                ? "Join us and start your journey today."
                : "Sign in to continue where you left off."}
            </p>
          </div>

          <div className="w-full min-h-[26rem] max-w-sm mx-auto">
            {isSignUp ? (
              <SignupForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={onSubmit}
                error={error}
                // NOTE: Update internal component colors (e.g., button, focus ring) to violet here.
              />
            ) : (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={onSubmit}
                error={error}
                // NOTE: Update internal component colors (e.g., button, focus ring) to violet here.
              />
            )}

            {/* Switch between login/signup (UPDATED TO VIOLET) */}
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 transition-colors"
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>

            {/* Divider + GitHub login */}
            <div className="mt-8">
              <div className="relative flex justify-center text-sm mb-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative z-10 bg-white dark:bg-gray-800 px-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">
                    or social login
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <GitLoginBtn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
