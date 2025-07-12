"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { removeSession } from "@/lib/session";

function getTokenFromCookie() {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  async function fetchUser() {
    const token = getTokenFromCookie();
    const res = await fetch("/api/session", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setUser(data.user);
  }

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  function handleLogout() {
    removeSession();
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold text-indigo-700">TatkalTicket</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-indigo-700 font-medium">{user.email}</span>
            <Link
              href="/profile"
              className="px-4 py-2 rounded bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 