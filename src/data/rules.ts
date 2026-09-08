import type { RuleCategory } from '../types';

export const ruleCategories: RuleCategory[] = [
  {
    id: 'general',
    title: 'General',
    rules: [
      { id: 'g1', text: 'Treat every player with respect. Harassment, hate speech, and trolling are zero-tolerance.' },
      { id: 'g2', text: 'One character per player. No alt accounts or shared accounts.' },
      { id: 'g3', text: 'No hacking, exploiting, duping, macros, or glitching.' },
      { id: 'g4', text: 'No advertising other servers.' },
      { id: 'g5', text: 'No real-money trades. Scams result in a permanent ban.' },
      { id: 'g6', text: 'Follow Discord rules and keep support requests in tickets.' },
    ],
  },
  {
    id: 'building',
    title: 'Building',
    rules: [
      { id: 'b1', text: 'Max 2 bases per tribe, per map. A 3rd base is removed without warning.' },
      { id: 'b2', text: 'Bases must be at least 500 meters apart. Main bases may not exceed a 500m radius.' },
      { id: 'b3', text: 'No under-map, mesh, or glitch builds. No artifact caves, obelisks, or spawn zones.' },
      { id: 'b4', text: 'No structure spam. Temporary build pieces must be removed.' },
      { id: 'b5', text: 'Max 10,000 structures per tribe, per map. Max 3 ocean platforms and 4 cloning chambers.' },
      { id: 'b6', text: 'Tek Replicators must be turned off before logout. Oil rigs must remain unlocked.' },
    ],
  },
  {
    id: 'pvp',
    title: 'PvP & Raiding',
    rules: [
      { id: 'p1', text: 'This cluster is PvE. Unauthorised PvP griefing is forbidden.' },
      { id: 'p2', text: 'No blocking bases or paths, trapping players, or luring wilds to bases.' },
      { id: 'p3', text: 'No stealing tames, drops, or resources from other players.' },
      { id: 'p4', text: 'Event PvP follows event-specific rules announced in Discord.' },
    ],
  },
  {
    id: 'taming',
    title: 'Taming & Breeding',
    rules: [
      { id: 't1', text: 'No blocking resources or paths with tames. Abandoned dinos may be removed.' },
      { id: 't2', text: 'No stacking dinos. No stealing or trapping tames. First hit equals claim.' },
      { id: 't3', text: 'No A-tier or S-tier dinos gifted to players under 7 days in Discord.' },
      { id: 't4', text: 'All gifted and traded mutated dinos must be spayed or neutered.' },
      { id: 't5', text: 'No dinos left at obelisks or caves.' },
    ],
  },
  {
    id: 'trading',
    title: 'Trading',
    rules: [
      { id: 'tr1', text: 'All trades must be documented in the PvE Trading Channel.' },
      { id: 'tr2', text: 'No reselling breedable lines without the breeder’s permission.' },
      { id: 'tr3', text: 'Monthly Pack creatures may only be traded among owners during the active month.' },
      { id: 'tr4', text: 'Points trading is allowed through approved shop systems.' },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    rules: [
      { id: 'e1', text: 'Event rules override standard rules only for the duration of the event.' },
      { id: 'e2', text: 'Respect event hosts and do not grief event spaces.' },
      { id: 'e3', text: 'Prize disputes must go through support tickets with evidence.' },
    ],
  },
  {
    id: 'enforcement',
    title: 'Enforcement',
    rules: [
      { id: 'en1', text: 'Admins may remove rule-breaking content without prior warning when necessary.' },
      { id: 'en2', text: 'Violations may result in wipes, suspensions, or bans.' },
      { id: 'en3', text: 'Appeals must go through tickets. Do not DM admins for rule enforcement.' },
      { id: 'en4', text: 'Lag-causing bases may be wiped for cluster health.' },
    ],
  },
];
