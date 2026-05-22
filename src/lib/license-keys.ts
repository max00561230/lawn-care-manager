/**
 * License key validation utility.
 *
 * Keys are in the format JRT-XXXX-XXXX-XXXX where each X is an alphanumeric
 * character from a reduced alphabet that excludes easily-confused glyphs:
 *   O, 0, 1, I, l
 */

const KEY_PREFIX = "JRT";

/**
 * Validate that a string matches the expected license key format.
 */
export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = new RegExp(
    `^${KEY_PREFIX}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`
  );

  if (!pattern.test(key)) {
    return false;
  }

  // Ensure no ambiguous characters are present in the body
  const ambiguous = /[O01Il]/;
  const body = key.slice(KEY_PREFIX.length + 1);
  return !ambiguous.test(body);
}