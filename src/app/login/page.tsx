"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import GitLoginBtn from "@/components/GitLoginBtn";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { handleAuthAction } from "./actions";

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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Login"}
      </h1>

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
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={onSubmit}
          error={error}
        />
      )}

      <p className="mt-3 text-sm text-gray-600">
        {isSignUp ? "Already have an account?" : "No account yet?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 underline"
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>

      <div className="mt-4">
        <p className="text-sm mb-2">Or login with GitHub:</p>
        <GitLoginBtn />
      </div>
    </div>
  );
}
