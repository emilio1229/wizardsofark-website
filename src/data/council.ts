import type { CouncilMember } from '../types/council';
import { councilImagePath } from '../assets/council';

/** Default selected council member on page load. */
export const DEFAULT_COUNCIL_MEMBER_ID = 'high-realm-master';

/**
 * Council constellation data — roles match the original Arcane Council roster.
 * Angles are degrees where 0 = east / right and -90 = north / top.
 *
 * Portraits live in: public/assets/council/
 */
export const councilMembers: CouncilMember[] = [
  {
    id: 'high-realm-master',
    name: 'Brendon',
    title: 'High Realm Master',
    role: 'Realm Masters',
    tagline: 'Cluster direction & balance',
    avatar: councilImagePath('brendon.png'),
    portrait: councilImagePath('brendon.png'),
    energyColor: '#A968FF',
    bio: 'Oversees cluster direction, balance, and major decisions.',
    responsibilities: ['Cluster direction', 'Balance', 'Major decisions'],
    accessLevel: 'Full Admin',
    status: 'online',
    quote: 'A greater tomorrow, built together.',
    angle: -90,
  },
  {
    id: 'archmage-of-the-realms',
    name: 'Wizard',
    title: 'Archmage of the Realms',
    role: 'Realm Masters',
    tagline: 'Arcane systems & identity',
    avatar: councilImagePath('wizard.png'),
    portrait: councilImagePath('wizard.png'),
    energyColor: '#D6B36A',
    bio: 'Guardian of arcane systems, cluster stability, and magical identity.',
    responsibilities: ['Arcane systems', 'Cluster stability', 'Magical identity'],
    accessLevel: 'Full Admin',
    status: 'online',
    angle: -45,
  },
  {
    id: 'warden-of-order',
    name: 'Heathen',
    title: 'Warden of Order',
    role: 'Realm Masters',
    tagline: 'Integrity & structure',
    avatar: councilImagePath('heathen.png'),
    portrait: councilImagePath('heathen.png'),
    energyColor: '#FF4F65',
    bio: 'Enforcer of cluster integrity, rules, and long-term structure.',
    responsibilities: ['Cluster integrity', 'Rules', 'Long-term structure'],
    accessLevel: 'Full Admin',
    status: 'online',
    angle: 0,
  },
  {
    id: 'supreme-wizard',
    name: 'Emilio The Great',
    title: 'Supreme Wizard',
    role: 'Supreme Wizard',
    tagline: 'Support & conflict resolution',
    avatar: councilImagePath('emilio.png'),
    portrait: councilImagePath('emilio.png'),
    energyColor: '#4DA6FF',
    bio: 'Senior administrator responsible for high-level support and conflict resolution.',
    responsibilities: ['High-level support', 'Conflict resolution'],
    accessLevel: 'Admin',
    status: 'online',
    angle: 45,
  },
  {
    id: 'arcane-technomancer',
    name: 'B1R0N',
    title: 'Arcane Technomancer',
    role: 'Systems & Development',
    tagline: 'Where others wield spells, the Technomancer wields code.',
    avatar: councilImagePath('b1r0n.png'),
    portrait: councilImagePath('b1r0n.png'),
    energyColor: '#C5C9D1',
    bio: "Admin-exclusive role responsible for technical systems, development, and architecture — turning the Realm Master's and Supreme Wizards' wildest ideas into reality.",
    responsibilities: ['Technical systems', 'Development', 'Architecture', 'Automation'],
    accessLevel: 'Admin',
    status: 'online',
    quote: 'Where others wield spells, the Technomancer wields code.',
    angle: 90,
  },
  {
    id: 'high-wizard-panda',
    name: 'Panda',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: councilImagePath('panda.png'),
    portrait: councilImagePath('panda.png'),
    energyColor: '#52E47C',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    angle: 135,
  },
  {
    id: 'high-wizard-rin',
    name: 'Rin',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: councilImagePath('rin.png'),
    portrait: councilImagePath('rin.png'),
    energyColor: '#36CFFF',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    angle: 180,
  },
  {
    id: 'high-wizard-doxo',
    name: 'Doxo',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: councilImagePath('doxo.png'),
    portrait: councilImagePath('doxo.png'),
    energyColor: '#FF9F43',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    angle: -135,
  },
];

export const councilPrinciples = [
  'Balance — All players treated equally',
  'Transparency — All actions logged',
  'Neutrality — No favoritism or admin advantage',
  'Proof — Assistance requires evidence',
  'Conduct — Professional behavior at all times',
  'Duty — Admin mode only for tickets and enforcement',
];

export const councilAutomation = [
  'Wizards of Ark Bot — Realm automation and announcements',
  'Wizards of Ark Raffle Bot — Raffle and event automation',
  'Helena ASA — ASA data assistant',
  'Ticket Tool — Support ticket management',
  'Awesome ARK Tools — Utility and cluster tools',
  'Sesh — Scheduling and reminders',
];

export function getCouncilMemberById(
  members: CouncilMember[],
  id: string,
): CouncilMember | undefined {
  return members.find((member) => member.id === id);
}
