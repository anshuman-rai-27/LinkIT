"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from '../../lib/session';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.token) {
        setSession(data.token);
        router.push("/");
        router.refresh();
      }
    } else {
      setError(data.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="bg-white px-8 py-10 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-center mb-6 font-bold text-3xl text-indigo-800 tracking-tight">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-lg border border-indigo-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-700 text-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="px-4 py-3 rounded-lg border border-indigo-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-700 text-gray-700"
          />
          <button type="submit" className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-lg py-3 font-semibold text-lg shadow hover:from-indigo-600 hover:to-indigo-500 transition">Login</button>
          {error && <div className="text-red-500 mt-1 text-center text-sm">{error}</div>}
        </form>
        <p className="mt-6 text-center text-indigo-500 text-sm">
          Don&apos;t have an account? <a href="/signup" className="text-indigo-800 font-semibold underline">Sign up</a>
        </p>
      </div>
    </div>
  );
} 