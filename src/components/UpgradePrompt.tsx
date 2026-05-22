"use client";

import React, { useState } from "react";
import { usePlan } from "./PlanProvider";
import { PLAN_NAMES, PLAN_PRICES } from "@/lib/plan-limits";

export function UpgradePrompt() {
  const { upgradeVisible, hideUpgrade, upgradeResource, activateFullPlan } = usePlan();
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [activated, setActivated] = useState(false);

  if (!upgradeVisible) return null;

  const handleActivate = () => {
    setError("");
    const success = activateFullPlan(licenseKey.trim());
    if (success) {
      setActivated(true);
      setTimeout(() => {
        setActivated(false);
        setLicenseKey("");
        hideUpgrade();
      }, 2000);
    } else {
      setError("Invalid license key. Keys start with JRT-");
    }
  };

  const limitInfo = upgradeResource
    ? {
        customers: { label: "Customers", free: 3, full: "∞" },
        services: { label: "Services", free: 3, full: "∞" },
        quotes: { label: "Quotes / Estimates", free: 3, full: "∞" },
        payments: { label: "Payment Collection", free: "🔒 Locked", full: "✅ Unlocked" },
      }[upgradeResource] || null
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Upgrade to Pro</h2>
              <p className="text-green-100 text-sm mt-1">
                {limitInfo
                  ? `You've reached the Free Plan limit for ${limitInfo.label.toLowerCase()}.`
                  : "Unlock the full power of LawnCare Manager Pro."}
              </p>
            </div>
            <button onClick={hideUpgrade} className="text-white/80 hover:text-white text-2xl leading-none">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Comparison */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Feature</span>
              <div className="flex gap-6">
                <span className="text-gray-500 w-16 text-right">{PLAN_NAMES.free}</span>
                <span className="text-green-700 font-semibold w-16 text-right">{PLAN_NAMES.full}</span>
              </div>
            </div>
            <div className="border-t border-gray-200" />
            {[
              { label: "Customers", free: "3", full: "Unlimited" },
              { label: "Services", free: "3", full: "Unlimited" },
              { label: "Quotes", free: "3", full: "Unlimited" },
              { label: "Appointments", free: "Unlimited", full: "Unlimited" },
              { label: "Tasks", free: "Unlimited", full: "Unlimited" },
              { label: "Payments", free: "🔒 Locked", full: "✅ Unlocked" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{row.label}</span>
                <div className="flex gap-6">
                  <span className={`w-16 text-right ${row.free.includes("3") || row.free.includes("Locked") ? "text-red-500" : "text-gray-600"}`}>
                    {row.free}
                  </span>
                  <span className="w-16 text-right font-semibold text-green-700">{row.full}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Current limit reached highlight */}
          {limitInfo && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-red-700 font-medium text-sm">
                ⚠️ You&apos;ve reached the {limitInfo.free} {limitInfo.label.toLowerCase()} limit on your Free Plan.
              </p>
            </div>
          )}

          {/* License Key Activation */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Activate with License Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => { setLicenseKey(e.target.value.toUpperCase()); setError(""); }}
                placeholder="JRT-XXXX-XXXX-XXXX"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono tracking-wider"
                disabled={activated}
              />
              <button
                onClick={handleActivate}
                disabled={!licenseKey.trim() || activated}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {activated ? "✅ Activated!" : "Activate"}
              </button>
            </div>
            {error && <p className="text-red-600 text-xs">{error}</p>}
          </div>

          {/* Purchase link */}
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-2">
              Don&apos;t have a license key yet?
            </p>
            <a
              href="https://jaderosetech.com/store/lawn-care-manager-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-semibold"
            >
              🛒 Purchase LawnCare Manager Pro — {PLAN_PRICES.full}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-gray-400 text-xs">Free Plan — no expiration, no credit card required. Upgrade anytime.</p>
        </div>
      </div>
    </div>
  );
}