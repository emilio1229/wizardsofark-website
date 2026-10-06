import {
  parseArkStatusServer,
  parseArkStatusServerList,
} from "../providers/arkstatus-parser";

const REAL_SHAPED_RECORD = {
  id: 4184181535,
  name: "The Wizards of Ark \\Ragnarok\\No Wipe\\All Maps\\Boosted",
  ip: "37.10.115.234",
  port: "5970",
  map: "Ragnarok_WP",
  status: "online",
  players: 4,
  max_players: 32,
  player_percentage: 12.5,
  platform: "PC",
  game_mode: "PVE",
  is_official: 0,
  has_password: 0,
  owner_verified: 0,
  version: "94.15",
  ping: 155,
  day_number: 767,
  cluster_id: "UcqUjN93gkEDESYg-utSESnI-QNY6I0nuqFni93L7xw",
  last_updated: "2026-10-06 08:48:55",
  timestamp: "2026-10-06 08:46:54",
};

describe("ArkStatus parser", () => {
  it("parses a real-shaped listing record using flat ip/port", () => {
    const parsed = parseArkStatusServer(REAL_SHAPED_RECORD);

    expect(parsed).not.toBeNull();
    expect(parsed?.id).toBe("37.10.115.234:5970");
    expect(parsed?.name).toContain("The Wizards of Ark");
    expect(parsed?.mapId).toBe("ragnarok");
    expect(parsed?.players).toBe(4);
    expect(parsed?.maxPlayers).toBe(32);
    expect(parsed?.isPve).toBe(true);
    expect(parsed?.version).toBe("94.15");
    expect(parsed?.ping).toBe(155);
    expect(parsed?.queryPort).toBeNull();
  });

  it("falls back to nested connection_info from the detail endpoint", () => {
    const { ip: _ip, port: _port, ...withoutFlat } = REAL_SHAPED_RECORD;
    const parsed = parseArkStatusServer({
      ...withoutFlat,
      connection_info: { ip: "192.168.1.100", port: 27015, query_port: 27016 },
    });

    expect(parsed?.id).toBe("192.168.1.100:27015");
    expect(parsed?.queryPort).toBe(27016);
  });

  it("maps PVP and PVPVE game modes to a false isPve flag", () => {
    expect(
      parseArkStatusServer({ ...REAL_SHAPED_RECORD, game_mode: "PVP" })?.isPve,
    ).toBe(false);
    expect(
      parseArkStatusServer({ ...REAL_SHAPED_RECORD, game_mode: "PVPVE" })
        ?.isPve,
    ).toBe(false);
  });

  it("skips records without connection details instead of throwing", () => {
    const { ip: _ip, port: _port, ...withoutConnection } = REAL_SHAPED_RECORD;
    expect(parseArkStatusServer(withoutConnection)).toBeNull();
  });

  it("unwraps the { success, data } envelope and counts skipped records", () => {
    const result = parseArkStatusServerList({
      success: true,
      data: [REAL_SHAPED_RECORD, { name: "broken" }],
      meta: { timestamp: 1736255445, version: "v1" },
    });

    expect(result.servers).toHaveLength(1);
    expect(result.skipped).toBe(1);
  });

  it("throws on an error envelope from the API", () => {
    expect(() =>
      parseArkStatusServerList({
        success: false,
        error: { message: "Rate limit exceeded", code: "RATE_LIMIT_EXCEEDED" },
      }),
    ).toThrow(/Rate limit exceeded/);
  });
});
