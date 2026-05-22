"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PlanTier, PLAN_LIMITS, STORAGE_KEY_PLAN, wouldExceedLimit, getRemaining } from "@/lib/plan-limits";
import { activateLicenseKey, verifyLicense } from "@/lib/license-api";

interface PlanContextType {
  tier: PlanTier;
  isFree: boolean;
  isFull: boolean;
  setTier: (tier: PlanTier) => void;
  canAdd: (resource: "customers" | "services" | "quotes", currentCount: number) => boolean;
  remaining: (resource: "customers" | "services" | "quotes", currentCount: number) => number | null;
  isLocked: (feature: "payments") => boolean;
  showUpgrade: (resource?: string) => void;
  hideUpgrade: () => void;
  upgradeVisible: boolean;
  upgradeResource: string | null;
  activateFullPlan: (licenseKey: string) => Promise<{ ok: boolean; message?: string; revoked?: boolean }>;
}

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<PlanTier>("free");
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [upgradeResource, setUpgradeResource] = useState<string | null>(null);

  // Load plan from localStorage on mount + verify license with server
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY_PLAN);
    if (stored === "free" || stored === "full") {
      setTierState(stored);
    }

    // If user has a stored license, verify it's still valid on mount
    const storedLicense = localStorage.getItem("lcm_license");
    if (storedLicense && stored === "full") {
      verifyLicense().then((result) => {
        if (!result.ok) {
          // License revoked or device no longer authorized — downgrade
          setTier("free");
          localStorage.removeItem("lcm_license");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTier = useCallback((newTier: PlanTier) => {
    setTierState(newTier);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PLAN, newTier);
    }
  }, []);

  const canAdd = useCallback(
    (resource: "customers" | "services" | "quotes", currentCount: number): boolean => {
      return !wouldExceedLimit(resource, currentCount, tier);
    },
    [tier]
  );

  const remaining = useCallback(
    (resource: "customers" | "services" | "quotes", currentCount: number): number | null => {
      return getRemaining(resource, currentCount, tier);
    },
    [tier]
  );

  const isLocked = useCallback(
    (feature: "payments"): boolean => {
      if (feature === "payments") return !PLAN_LIMITS[tier].payments;
      return false;
    },
    [tier]
  );

  const showUpgrade = useCallback((resource?: string) => {
    setUpgradeResource(resource || null);
    setUpgradeVisible(true);
  }, []);

  const hideUpgrade = useCallback(() => {
    setUpgradeVisible(false);
    setUpgradeResource(null);
  }, []);

  // Activate full plan via real JRT license API
  const activateFullPlan = useCallback(
    async (licenseKey: string): Promise<{ ok: boolean; message?: string; revoked?: boolean }> => {
      try {
        const result = await activateLicenseKey(licenseKey);

        if (result.ok) {
          setTier("full");
          return { ok: true };
        }

        return { ok: false, message: result.message, revoked: result.revoked };
      } catch {
        return { ok: false, message: "Unable to activate license. Please try again." };
      }
    },
    [setTier]
  );

  return (
    <PlanContext.Provider
      value={{
        tier,
        isFree: tier === "free",
        isFull: tier === "full",
        setTier,
        canAdd,
        remaining,
        isLocked,
        showUpgrade,
        hideUpgrade,
        upgradeVisible,
        upgradeResource,
        activateFullPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}