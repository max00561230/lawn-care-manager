"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/storage";

export default function SetupPage() {
  const router = useRouter();
  const { setup } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!businessName.trim()) {
      setError("Business name is required");
      return;
    }
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    if (!/^\d+$/.test(pin)) {
      setError("PIN must be numbers only");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setup(businessName.trim(), pin);
    router.push("/dashboard/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-lg shadow-green-500/20">
            🌿
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">LawnCare Manager Pro</h1>
          <p className="text-sm text-gray-500 mt-1">Set up your business to get started</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mb-4 font-medium">{error}</div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input-field"
              placeholder="Whitney's Lawn Care"
            />
            <p className="text-xs text-gray-400 mt-1">This will appear at the top of your app</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Create PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="input-field"
              placeholder="Min 4 digits"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              className="input-field"
              placeholder="Re-enter PIN"
            />
          </div>
          <button
            type="submit"
            className="w-full btn-accent py-3 text-center text-base"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Your data is stored locally on this device</p>
        </div>
      </div>
    </div>
  );
}