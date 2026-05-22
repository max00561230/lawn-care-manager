/**
 * License API client for LawnCare Manager Pro.
 *
 * Calls the JRT license activation and verification endpoints
 * on the JRT website (jrt-website).
 */

import { generateDeviceFingerprint, getDeviceLabel } from "./device-fingerprint";
import { validateLicenseKeyFormat } from "./license-keys";

/** JRT website base URL where the license API lives */
const JRT_API_BASE = "https://www.jaderosetech.com";

export interface LicenseActivationResult {
  ok: boolean;
  productSlug?: string;
  deviceLimit?: number;
  devicesActivated?: number;
  message?: string;
  revoked?: boolean;
}

/**
 * Activate a license key on this device.
 *
 * Calls POST /api/jrt/licenses/activate with the key and device fingerprint.
 * On success, stores the license info in localStorage for offline verification.
 */
export async function activateLicenseKey(licenseKey: string): Promise<LicenseActivationResult> {
  // Client-side format check before hitting the API
  const trimmed = licenseKey.trim().toUpperCase();
  if (!validateLicenseKeyFormat(trimmed)) {
    return { ok: false, message: "Invalid license key format. Keys look like JRT-XXXX-XXXX-XXXX." };
  }

  const deviceFingerprint = generateDeviceFingerprint();
  const deviceLabel = getDeviceLabel();

  if (!deviceFingerprint) {
    return { ok: false, message: "Unable to identify this device. Please try again." };
  }

  try {
    const response = await fetch(`${JRT_API_BASE}/api/jrt/licenses/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenseKey: trimmed,
        deviceFingerprint,
        deviceLabel,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      // Store activation locally for offline verification
      localStorage.setItem("lcm_license", JSON.stringify({
        key: trimmed,
        productSlug: data.productSlug,
        activatedAt: new Date().toISOString(),
        devicesActivated: data.devicesActivated,
        deviceLimit: data.deviceLimit,
      }));
    }

    return data;
  } catch {
    return {
      ok: false,
      message: "Unable to reach the license server. Please check your internet connection and try again.",
    };
  }
}

/**
 * Verify that a stored license is still valid on mount.
 *
 * Calls POST /api/jrt/licenses/verify with the stored key and device fingerprint.
 * Returns false if the license was revoked or the device is no longer authorized.
 */
export async function verifyLicense(): Promise<LicenseActivationResult> {
  const stored = localStorage.getItem("lcm_license");
  if (!stored) {
    return { ok: false, message: "No license stored." };
  }

  let licenseData: { key: string };
  try {
    licenseData = JSON.parse(stored);
  } catch {
    localStorage.removeItem("lcm_license");
    return { ok: false, message: "Corrupted license data." };
  }

  const deviceFingerprint = generateDeviceFingerprint();
  if (!deviceFingerprint) {
    return { ok: false, message: "Unable to identify device." };
  }

  try {
    const response = await fetch(`${JRT_API_BASE}/api/jrt/licenses/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        licenseKey: licenseData.key,
        deviceFingerprint,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      // License revoked or device no longer authorized — clear stored license
      localStorage.removeItem("lcm_license");
    }

    return data;
  } catch {
    // Network error — keep the stored license for now (assume valid offline)
    return { ok: true, productSlug: licenseData.key };
  }
}