import { z } from 'zod';

/**
 * Raw ASA unofficial server-list object.
 * Field names verified against the live CDN payload (see docs/ASA_SERVER_LIST_FIELDS.md).
 */
export const asaServerSchema = z
  .object({
    Name: z.string().optional(),
    SessionName: z.string().optional(),
    SessionNameUpper: z.string().optional(),
    MapName: z.union([z.string(), z.number()]).optional(),
    IP: z.string().optional(),
    Port: z.union([z.number(), z.string()]).optional(),
    LatencyPort: z.union([z.number(), z.string()]).optional(),
    NumPlayers: z.union([z.number(), z.string()]).optional(),
    MaxPlayers: z.union([z.number(), z.string()]).optional(),
    BuildId: z.union([z.number(), z.string()]).optional(),
    MinorBuildId: z.union([z.number(), z.string()]).optional(),
    ServerPing: z.union([z.number(), z.string()]).optional(),
    SessionID: z.string().optional(),
    ClusterId: z.string().optional(),
    SessionIsPve: z.union([z.number(), z.string(), z.boolean()]).optional(),
    LastUpdated: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough();

export type AsaServerRaw = z.infer<typeof asaServerSchema>;

export function coerceNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function coerceBooleanFlag(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1 ? true : value === 0 ? false : null;
  }
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase();
    if (normalised === '1' || normalised === 'true') {
      return true;
    }
    if (normalised === '0' || normalised === 'false') {
      return false;
    }
  }
  return null;
}
