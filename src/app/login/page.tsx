"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const { login, owner, isSetupComplete } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If no account set up yet, redirect to setup
  if (!isSetupComplete) {
    if (typeof window !== "undefined") {
      router.replace("/setup/");
    }
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    const success = login(email, password);
    if (success) {
      router.push("/dashboard/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <img src="/jrt-logo.png" alt="JRT" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
          <h1 className="text-2xl font-bold text-gray-900">LawnCare Manager Pro</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your business</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder={owner?.email || "your@email.com"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full btn-accent py-2.5 text-center"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Are you a customer?</p>
          <a href="/book/" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Book a service →
          </a>
        </div>
      </div>
    </div>
  );
}