"use client";
import { PasswordInput } from "./Password";

interface Props {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  error,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-inputs"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <PasswordInput password={password} setPassword={setPassword} />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium text-center mt-1">
          {error}
        </p>
      )}

      <button type="submit" className="login-buttons ">
        Login
      </button>
    </form>
  );
}
