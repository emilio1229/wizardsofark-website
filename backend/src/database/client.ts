import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

const BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS servers (
  id TEXT PRIMARY KEY NOT NULL,
  session_id TEXT,
  name TEXT NOT NULL,
  session_name TEXT,
  map_name TEXT,
  map_display_name TEXT NOT NULL,
  map_id TEXT NOT NULL,
  ip TEXT NOT NULL,
  game_port INTEGER NOT NULL,
  query_port INTEGER,
  first_seen TEXT NOT NULL,
  last_seen TEXT,
  last_checked TEXT NOT NULL,
  current_status TEXT NOT NULL,
  previous_status TEXT,
  players INTEGER,
  max_players INTEGER,
  version TEXT,
  ping INTEGER,
  cluster_id TEXT,
  is_pve INTEGER,
  missing_since TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS status_transitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id TEXT NOT NULL REFERENCES servers(id),
  from_status TEXT,
  to_status TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  note TEXT
);

CREATE TABLE IF NOT EXISTS poll_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_status_transitions_server_observed
  ON status_transitions(server_id, observed_at DESC);
`;

export type Db = ReturnType<typeof drizzle<typeof schema>>;

export function createDatabase(databasePath: string): { sqlite: Database.Database; db: Db } {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const sqlite = new Database(databasePath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(BOOTSTRAP_SQL);
  const db = drizzle(sqlite, { schema });
  return { sqlite, db };
}
