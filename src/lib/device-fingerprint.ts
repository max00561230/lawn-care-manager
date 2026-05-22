/**
 * Device fingerprinting utility for license activation.
 *
 * Generates a stable hash from browser properties to identify a device
 * without relying on cookies or external identifiers. The fingerprint
 * is persisted in localStorage so it stays stable across sessions.
 *
 * Uses the djb2 hash algorithm — no external dependencies.
 */

const STORAGE_KEY = "lcm_device_fingerprint";

/**
 * djb2 hash — a simple, fast, non-cryptographic string hash.
 * Returns a hex string.
 */
function djb2(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Collect browser properties that are stable across sessions for a given device.
 * Runs only on the client (browser).
 */
function collectDeviceSignals(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "";
  }

  const signals = [
    navigator.userAgent ?? "",
    navigator.language ?? "",
    String(screen?.width ?? 0),
    String(screen?.height ?? 0),
    String(navigator.hardwareConcurrency ?? 0),
    navigator.platform ?? "",
  ];

  return signals.join("|");
}

/**
 * Generate a device fingerprint.
 *
 * The fingerprint is computed once from browser signals and then
 * cached in localStorage for stability.
 *
 * Must be called on the client only.
 */
export function generateDeviceFingerprint(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return cached;
    }
  } catch {
    // localStorage unavailable — fall through to generate
  }

  const signals = collectDeviceSignals();
  const fingerprint = `fp_${djb2(signals)}`;

  try {
    localStorage.setItem(STORAGE_KEY, fingerprint);
  } catch {
    // Ignore storage errors
  }

  return fingerprint;
}

/**
 * Build a human-readable device label for display in license management.
 */
export function getDeviceLabel(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Unknown Device";
  }

  const uaFirstPart = navigator.userAgent.split(" ").slice(0, 1).join("") || "Unknown";
  const screenInfo = `${screen?.width ?? 0}x${screen?.height ?? 0}`;
  return `${uaFirstPart} - ${screenInfo}`;
}