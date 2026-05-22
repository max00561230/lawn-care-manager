"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { PlanTier, PLAN_LIMITS, STORAGE_KEY_PLAN, wouldExceedLimit, getRemaining } from "@/lib/plan-limits";

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
  activateFullPlan: (licenseKey: string) => boolean;
}

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<PlanTier>("free");
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [upgradeResource, setUpgradeResource] = useState<string | null>(null);

  // Load plan from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY_PLAN);
    if (stored === "free" || stored === "full") {
      setTierState(stored);
    }
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

  // Activate full plan with a license key
  const activateFullPlan = useCallback(
    (licenseKey: string): boolean => {
      // JRT license validation — for now, accept any key starting with JRT-
      // Full integration with jrt-license-system will be wired later
      if (licenseKey && licenseKey.startsWith("JRT-")) {
        setTier("full");
        return true;
      }
      return false;
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