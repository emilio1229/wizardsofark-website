# ASA Unofficial Server List — Observed Fields

Source: `https://cdn2.arkdedicated.com/servers/asa/unofficialserverlist.json`

Inspected: 2026-09-08 (response is a JSON array of server objects).

## Fields used by Wizards of Ark monitoring

| ASA field | Purpose |
|-----------|---------|
| `SessionID` | Stored for reference; **not** used as the primary key (may change across process restarts) |
| `IP` + `Port` | Stable composite server id (`ip:port`) and game connection address |
| `Name` | Server name (filter target) |
| `SessionName` | Display name including version suffix |
| `MapName` | Map identifier (e.g. `TheIsland_WP`) |
| `NumPlayers` | Current players |
| `MaxPlayers` | Capacity |
| `BuildId` + `MinorBuildId` | Version / build (`BuildId.MinorBuildId`) |
| `ServerPing` | Reported ping when present |
| `ClusterId` | Cluster membership when present |
| `SessionIsPve` | PvE flag (`1` / `0`) |
| `LastUpdated` | ASA-side last update timestamp (ms) |

## Ports

- `Port` is the **game port**.
- `LatencyPort` in the live payload is a non-numeric placeholder (e.g. `WinLiveLatecyCheckPort`), **not** a query port.
- Therefore `queryPort` is stored as `null` unless ASA later exposes a numeric query port.

## Unique identifier strategy

Primary id: `` `${IP}:${Port}` `` (stable across temporary list absence / restarts).

`SessionID` is persisted when available for diagnostics and future correlation.
