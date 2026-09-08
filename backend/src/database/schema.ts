import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const servers = sqliteTable('servers', {
  id: text('id').primaryKey(),
  sessionId: text('session_id'),
  name: text('name').notNull(),
  sessionName: text('session_name'),
  mapName: text('map_name'),
  mapDisplayName: text('map_display_name').notNull(),
  mapId: text('map_id').notNull(),
  ip: text('ip').notNull(),
  gamePort: integer('game_port').notNull(),
  queryPort: integer('query_port'),
  firstSeen: text('first_seen').notNull(),
  lastSeen: text('last_seen'),
  lastChecked: text('last_checked').notNull(),
  currentStatus: text('current_status').notNull(),
  previousStatus: text('previous_status'),
  players: integer('players'),
  maxPlayers: integer('max_players'),
  version: text('version'),
  ping: integer('ping'),
  clusterId: text('cluster_id'),
  isPve: integer('is_pve'),
  missingSince: text('missing_since'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const statusTransitions = sqliteTable('status_transitions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serverId: text('server_id')
    .notNull()
    .references(() => servers.id),
  fromStatus: text('from_status'),
  toStatus: text('to_status').notNull(),
  observedAt: text('observed_at').notNull(),
  note: text('note'),
});

export const pollMeta = sqliteTable('poll_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});
