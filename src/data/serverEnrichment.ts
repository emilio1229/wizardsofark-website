import type { ServerDetail } from '../types';

const baseMods = [
  'Cybers Structures QoL+',
  'Dino Depot',
  'Awesome Spyglass!',
  'Auto Engrams!',
  'Helena Bot Companion',
  "Resonant's Shop Mod",
  'Additions Ascended',
  'Shiny! Dinos Ascended',
];

const sharedSettings = [
  { label: 'XP Rate', value: '1.5x' },
  { label: 'Harvest', value: '5x' },
  { label: 'Taming', value: '10x' },
  { label: 'Player Weight', value: 'x15' },
  { label: 'Max Player Level', value: '190' },
  { label: 'Tribe Max', value: '6' },
];

type Enrichment = Pick<ServerDetail, 'description' | 'mods' | 'settings' | 'rules'>;

/** Optional editorial content keyed by mapId — live status always comes from the monitor API. */
export const serverEnrichmentByMapId: Record<string, Enrichment> = {
  'the-island': {
    description: 'The original ARK world — forests, caves, and the first steps of every wizard.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules', 'No griefing', 'Respect tribe boundaries'],
  },
  'scorched-earth': {
    description: 'Desert heat, wyverns, and scarce water — survive the dunes together.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules', 'No griefing'],
  },
  'the-center': {
    description: 'Floating islands and deep oceans for builders and explorers alike.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  ragnarok: {
    description: 'Vast biomes, wyvern trenches, and legendary landmarks.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  valguero: {
    description: 'Cliffside valleys, Deinonychus nests, and a map made for explorers.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  aberration: {
    description: 'Bioluminescent caverns, radiation zones, and creatures of the deep dark.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules', 'Respect radiation zone claims'],
  },
  extinction: {
    description: 'Corrupted earth, titans, and city ruins under magical siege.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  'genesis-1': {
    description: 'Simulation biomes and missions across a holographic realm.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  'genesis-2': {
    description: 'Starship corridors and wild gardens.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  'lost-colony': {
    description: 'A fractured colony where ethereal and corrupted forces collide.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  astraeos: {
    description: 'A new frontier of islands and mysteries for the realm.',
    mods: [...baseMods, 'Astraeos'],
    settings: sharedSettings,
    rules: ['Follow General and Building rules', 'No building on Ovis Island'],
  },
  dragontopia: {
    description: 'Dragon-ruled peaks and scale-forged legends for bold tribes.',
    mods: [...baseMods, 'Dragontopia'],
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  amissa: {
    description: 'Ancient stone paths and lantern-lit ruins deep in a verdant forgotten wild.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
  bjarnheim: {
    description: 'Snow-bound peaks and frostbitten forests under the watch of the north.',
    mods: baseMods,
    settings: sharedSettings,
    rules: ['Follow General and Building rules'],
  },
};
