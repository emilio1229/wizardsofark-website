import type { ArkMap, FeatureCardData } from '../types';
import { mapImagePath } from '../assets/maps';

export const arkMaps: ArkMap[] = [
  { id: 'the-island', name: 'The Island', image: mapImagePath('the-island') },
  { id: 'scorched-earth', name: 'Scorched Earth', image: mapImagePath('scorched-earth') },
  { id: 'the-center', name: 'The Center', image: mapImagePath('the-center') },
  { id: 'ragnarok', name: 'Ragnarok', image: mapImagePath('ragnarok') },
  { id: 'valguero', name: 'Valguero', image: mapImagePath('valguero') },
  { id: 'aberration', name: 'Aberration', image: mapImagePath('aberration') },
  { id: 'extinction', name: 'Extinction', image: mapImagePath('extinction') },
  { id: 'genesis-1', name: 'Genesis Part 1', image: mapImagePath('genesis-1') },
  { id: 'genesis-2', name: 'Genesis Part 2', image: mapImagePath('genesis-2') },
  { id: 'lost-colony', name: 'Lost Colony', image: mapImagePath('lost-colony') },
  { id: 'astraeos', name: 'Astraeos', image: mapImagePath('astraeos') },
  { id: 'dragontopia', name: 'Dragontopia', image: mapImagePath('dragontopia') },
  { id: 'amissa', name: 'Amissa', image: mapImagePath('amissa') },
  { id: 'bjarnheim', name: 'Bjarnheim', image: mapImagePath('bjarnheim') },
];

export const homeFeatures: FeatureCardData[] = [
  {
    id: 'servers',
    title: 'Multiple Servers',
    description: 'Live status across every official map in the Wizards of Ark cluster.',
    icon: 'dns',
    to: '/servers',
  },
  {
    id: 'council',
    title: 'The Council',
    description: 'Meet the guardians guiding balance, support, and the realm’s future.',
    icon: 'auto_awesome',
    to: '/council',
  },
  {
    id: 'community',
    title: 'Active Community',
    description: 'Events, guides, builds, and Discord — a guild hall beyond the servers.',
    icon: 'groups',
    to: '/community',
  },
  {
    id: 'shop',
    title: 'EOS Shop',
    description: 'Unlock exclusive skins, structures, and utilities with EOS points.',
    icon: 'storefront',
    to: '/shop',
  },
];
