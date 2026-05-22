// LawnCare Manager Pro — Plan Limits
// Free Plan (Try Before You Buy): limited to 3 customers, 3 services, 3 quotes
// Full Plan: unlimited everything, payments unlocked

export type PlanTier = 'free' | 'full';

export interface PlanLimit {
  customers: number | null;     // null = unlimited
  services: number | null;
  quotes: number | null;       // estimates
  appointments: number | null; // unlimited on both plans
  tasks: number | null;        // unlimited on both plans
  payments: boolean;           // false = locked behind upgrade
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimit> = {
  free: {
    customers: 3,
    services: 3,
    quotes: 3,
    appointments: null,  // unlimited even on free plan
    tasks: null,          // unlimited
    payments: false,      // locked behind upgrade
  },
  full: {
    customers: null,      // unlimited
    services: null,
    quotes: null,
    appointments: null,
    tasks: null,
    payments: true,       // unlocked
  },
};

export const PLAN_NAMES: Record<PlanTier, string> = {
  free: 'Free Plan',
  full: 'Pro Plan',
};

export const PLAN_PRICES: Record<PlanTier, string> = {
  free: '$0/mo',
  full: '$49/mo',
};

// Storage key for current plan
export const STORAGE_KEY_PLAN = 'lcm_plan_tier';

// Demo data indicator
export const STORAGE_KEY_DEMO = 'lcm_demo_data';

// Which features are gated by plan
export function isFeatureLocked(feature: 'payments', tier: PlanTier): boolean {
  if (feature === 'payments') return !PLAN_LIMITS[tier].payments;
  return false;
}

// Check if adding a new item would exceed the free plan limit
export function wouldExceedLimit(
  resource: 'customers' | 'services' | 'quotes',
  currentCount: number,
  tier: PlanTier
): boolean {
  const limit = PLAN_LIMITS[tier][resource];
  if (limit === null) return false; // unlimited
  return currentCount >= limit;
}

// Get remaining count for a resource (null = unlimited)
export function getRemaining(
  resource: 'customers' | 'services' | 'quotes',
  currentCount: number,
  tier: PlanTier
): number | null {
  const limit = PLAN_LIMITS[tier][resource];
  if (limit === null) return null; // unlimited
  return Math.max(0, limit - currentCount);
}