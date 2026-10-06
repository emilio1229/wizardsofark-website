import { z } from "zod";

/**
 * Raw object from the ARK Status API (https://arkstatus.com/api/v1).
 * Field names follow the documented `/servers` listing response:
 * `server_name` is transformed to `name`, and `is_pve` to `game_mode`
 * ("PVE" | "PVP" | "PVPVE").
 */
export const arkStatusServerSchema = z
  .object({
    id: z.union([z.number(), z.string()]).optional(),
    name: z.string().optional(),
    map: z.union([z.string(), z.number()]).optional(),
    status: z.string().optional(),
    players: z.union([z.number(), z.string()]).optional(),
    max_players: z.union([z.number(), z.string()]).optional(),
    platform: z.string().optional(),
    game_mode: z.string().optional(),
    is_official: z.union([z.number(), z.string(), z.boolean()]).optional(),
    has_password: z.union([z.number(), z.string(), z.boolean()]).optional(),
    owner_verified: z.union([z.number(), z.string(), z.boolean()]).optional(),
    version: z.union([z.number(), z.string()]).optional(),
    ping: z.union([z.number(), z.string()]).optional(),
    day_number: z.union([z.number(), z.string()]).optional(),
    last_updated: z.string().optional(),
    last_seen: z.string().optional(),
    // The listing endpoint returns connection details as flat top-level fields.
    ip: z.string().optional(),
    port: z.union([z.number(), z.string()]).optional(),
    // The detail endpoint nests them instead; support both shapes.
    connection_info: z
      .object({
        ip: z.string().optional(),
        port: z.union([z.number(), z.string()]).optional(),
        query_port: z.union([z.number(), z.string()]).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type ArkStatusServerRaw = z.infer<typeof arkStatusServerSchema>;

/**
 * Envelope returned by every ARK Status endpoint:
 * `{ success, data, meta }`.
 */
export const arkStatusEnvelopeSchema = z
  .object({
    success: z.boolean().optional(),
    data: z.unknown(),
    error: z
      .object({
        message: z.string().optional(),
        code: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type ArkStatusEnvelope = z.infer<typeof arkStatusEnvelopeSchema>;
