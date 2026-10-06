/**
 * Shared coercion helpers for upstream server-list payloads.
 *
 * These lived in `asa-schema.ts` alongside the CDN-specific Zod schema. The CDN
 * source has been removed, so the generic helpers now live on their own.
 */

export function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function coerceBooleanFlag(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1 ? true : value === 0 ? false : null;
  }
  if (typeof value === "string") {
    const normalised = value.trim().toLowerCase();
    if (normalised === "1" || normalised === "true") {
      return true;
    }
    if (normalised === "0" || normalised === "false") {
      return false;
    }
  }
  return null;
}
