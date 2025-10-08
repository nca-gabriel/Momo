"use client";
import { PasswordInput } from "./Password";

interface Props {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
}

export default function SignupForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  error,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="login-inputs"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-inputs"
        required
      />
      <PasswordInput password={password} setPassword={setPassword} />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="login-buttons">
        Sign Up
      </button>
    </form>
  );
}
