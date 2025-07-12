"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { removeSession } from "@/lib/session";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

function getTokenFromCookie() {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
    setIsMounted(true);
    fetchUser();
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    removeSession();
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  // Prevent hydration mismatch by showing a consistent initial state
  if (!isMounted) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <Link href="/" className="text-xl font-bold text-purple-700">LinkIT</Link>
      <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
          >
            Login
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-md relative" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-purple-700">LinkIT</Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
        {user ? (
          <>
                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                  <Link 
                    href="/" 
                    className={`text-sm font-medium transition-colors ${
                      pathname === '/' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/home" 
                    className={`text-sm font-medium transition-colors ${
                      pathname === '/home' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Explore
                  </Link>
                  <Link 
                    href="/requests" 
                    className={`text-sm font-medium transition-colors ${
                      pathname === '/requests' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    Requests
                  </Link>
                </div>

                {/* User Avatar Dropdown */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || user.email} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name || user.email} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-semibold">
                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.name || user.email?.split('@')[0]}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {user ? (
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link 
                    href="/" 
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/home" 
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Explore
                  </Link>
                  <Link 
                    href="/requests" 
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === '/requests' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Requests
                  </Link>
                </div>

                {/* Mobile User Profile */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {/* User Avatar */}
                    <div className="relative">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || user.email} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="px-4 space-y-2">
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition text-sm text-center"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
          <Link
            href="/login"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            Login
          </Link>
                <Link
                  href="/signup"
                  className="block mx-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 