"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setSession } from '../../lib/session';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      // Check if response is ok before trying to parse JSON
      if (!res.ok) {
        // Try to parse error response as JSON
        let errorMessage = "Signup failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = res.statusText || errorMessage;
        }
        setError(errorMessage);
        return;
      }
      
      // Parse successful response
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        setError("Invalid response from server");
        return;
      }
      
      if (data.token) {
        setSession(data.token);
        router.push("/");
        router.refresh();
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="bg-white px-8 py-10 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-center mb-6 font-bold text-3xl text-indigo-800 tracking-tight">Sign Up</h2>
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
          <button type="submit" className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-lg py-3 font-semibold text-lg shadow hover:from-indigo-600 hover:to-indigo-500 transition">Sign Up</button>
          {error && <div className="text-red-500 mt-1 text-center text-sm">{error}</div>}
          {success && <div className="text-green-500 mt-1 text-center text-sm">Signup successful! Redirecting...</div>}
        </form>
        <p className="mt-6 text-center text-indigo-500 text-sm">
          Already have an account? <a href="/login" className="text-indigo-800 font-semibold underline">Login</a>
        </p>
      </div>
    </div>
  );
} 