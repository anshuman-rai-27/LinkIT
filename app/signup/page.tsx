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
      
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
      {success ? (
        <div className="bg-white px-8 py-10 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Email Verification Required</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please check your email inbox and click the verification link to activate your account.</p>
                    <p className="mt-1">If you don't see the email, check your spam folder.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">You'll be redirected to the login page in a few seconds...</p>
            <button 
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-lg py-3 px-6 font-semibold text-lg shadow hover:from-indigo-600 hover:to-indigo-500 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
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
          </form>
          <p className="mt-6 text-center text-indigo-500 text-sm">
            Already have an account? <a href="/login" className="text-indigo-800 font-semibold underline">Login</a>
          </p>
        </div>
      )}
    </div>
  );
} 