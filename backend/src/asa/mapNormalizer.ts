/** MapName values observed from ASA → stable mapId + display name. */
const MAP_DEFINITIONS: Array<{
  patterns: RegExp[];
  mapId: string;
  displayName: string;
}> = [
  { patterns: [/^TheIsland(_WP)?$/i, /^Island$/i], mapId: 'the-island', displayName: 'The Island' },
  {
    patterns: [/^ScorchedEarth(_WP)?$/i, /^Scorched$/i],
    mapId: 'scorched-earth',
    displayName: 'Scorched Earth',
  },
  { patterns: [/^TheCenter(_WP)?$/i, /^Center$/i], mapId: 'the-center', displayName: 'The Center' },
  { patterns: [/^Ragnarok(_WP)?$/i], mapId: 'ragnarok', displayName: 'Ragnarok' },
  { patterns: [/^Valguero(_WP)?$/i], mapId: 'valguero', displayName: 'Valguero' },
  { patterns: [/^Aberration(_WP)?$/i], mapId: 'aberration', displayName: 'Aberration' },
  { patterns: [/^Extinction(_WP)?$/i], mapId: 'extinction', displayName: 'Extinction' },
  {
    patterns: [/^Genesis(_WP)?$/i, /^GenesisPart1(_WP)?$/i, /^Gen1(_WP)?$/i],
    mapId: 'genesis-1',
    displayName: 'Genesis Part 1',
  },
  {
    patterns: [/^Gen2(_WP)?$/i, /^Genesis2(_WP)?$/i, /^GenesisPart2(_WP)?$/i],
    mapId: 'genesis-2',
    displayName: 'Genesis Part 2',
  },
  { patterns: [/^LostColony(_WP)?$/i], mapId: 'lost-colony', displayName: 'Lost Colony' },
  { patterns: [/^Astraeos(_WP)?$/i], mapId: 'astraeos', displayName: 'Astraeos' },
  { patterns: [/^Dragontopia(_WP)?$/i], mapId: 'dragontopia', displayName: 'Dragontopia' },
  { patterns: [/^Bjarnheim(_WP)?$/i], mapId: 'bjarnheim', displayName: 'Bjarnheim' },
  { patterns: [/^Amissa(_WP)?$/i], mapId: 'amissa', displayName: 'Amissa' },
];

function humaniseMapToken(raw: string): string {
  return raw
    .replace(/_WP$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
}

export function normaliseMap(mapName: string | null | undefined): {
  mapId: string;
  displayName: string;
} {
  const raw = (mapName ?? '').trim();
  if (!raw) {
    return { mapId: 'unknown', displayName: 'Unknown Map' };
  }

  for (const definition of MAP_DEFINITIONS) {
    if (definition.patterns.some((pattern) => pattern.test(raw))) {
      return { mapId: definition.mapId, displayName: definition.displayName };
    }
  }

  const displayName = humaniseMapToken(raw) || 'Unknown Map';
  const mapId = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'unknown';

  return { mapId, displayName };
}
