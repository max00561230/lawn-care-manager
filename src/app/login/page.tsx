"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/storage";

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function LoginPage() {
  const router = useRouter();
  const { login, owner, isSetupComplete } = useAuth();
  const [pin, setPin] = useState("");
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

    if (!pin) {
      setError("Please enter your PIN");
      return;
    }

    const success = login(pin);
    if (success) {
      router.push("/dashboard/");
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-green-500/20">
            {owner?.businessName ? getInitials(owner.businessName) : "🌿"}
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {owner?.businessName || "LawnCare Manager Pro"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Enter your PIN to sign in</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mb-4 font-medium">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="input-field text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="••••"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full btn-accent py-3 text-center text-base"
          >
            Unlock
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Are you a customer?</p>
          <a href="/book/" className="text-sm text-green-600 hover:text-green-700 font-semibold">
            Book a service →
          </a>
        </div>
      </div>
    </div>
  );
}