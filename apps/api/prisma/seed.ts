import { PrismaClient } from '@prisma/client';
import { DEFAULT_MAP_ORDER } from '@woa/shared';

const prisma = new PrismaClient();

const MAP_SEEDS: Array<{
  id: string;
  name: string;
  displayName: string;
  imagePath: string;
}> = [
  { id: 'the-island', name: 'the-island', displayName: 'The Island', imagePath: '/assets/maps/the-island.jpg' },
  { id: 'scorched-earth', name: 'scorched-earth', displayName: 'Scorched Earth', imagePath: '/assets/maps/scorched-earth.jpg' },
  { id: 'aberration', name: 'aberration', displayName: 'Aberration', imagePath: '/assets/maps/aberration.jpg' },
  { id: 'extinction', name: 'extinction', displayName: 'Extinction', imagePath: '/assets/maps/extinction.jpg' },
  { id: 'ragnarok', name: 'ragnarok', displayName: 'Ragnarok', imagePath: '/assets/maps/ragnarok.jpg' },
  { id: 'valguero', name: 'valguero', displayName: 'Valguero', imagePath: '/assets/maps/valguero.jpg' },
  { id: 'genesis-1', name: 'genesis-1', displayName: 'Genesis Part 1', imagePath: '/assets/maps/genesis-1.jpg' },
  { id: 'genesis-2', name: 'genesis-2', displayName: 'Genesis Part 2', imagePath: '/assets/maps/genesis-2.jpg' },
  { id: 'the-center', name: 'the-center', displayName: 'The Center', imagePath: '/assets/maps/the-center.jpg' },
  { id: 'lost-colony', name: 'lost-colony', displayName: 'Lost Colony', imagePath: '/assets/maps/lost-colony.jpg' },
  { id: 'astraeos', name: 'astraeos', displayName: 'Astraeos', imagePath: '/assets/maps/astraeos.jpg' },
  { id: 'dragontopia', name: 'dragontopia', displayName: 'Dragontopia', imagePath: '/assets/maps/dragontopia.jpg' },
  { id: 'amissa', name: 'amissa', displayName: 'Amissa', imagePath: '/assets/maps/amissa.jpg' },
  { id: 'bjarnheim', name: 'bjarnheim', displayName: 'Bjarnheim', imagePath: '/assets/maps/bjarnheim.jpg' },
];

const COUNCIL_SEEDS = [
  {
    id: 'high-realm-master',
    name: 'Brendon',
    title: 'High Realm Master',
    role: 'Realm Masters',
    tagline: 'Cluster direction & balance',
    avatar: '/assets/council/brendon.png',
    portrait: '/assets/council/brendon.png',
    energyColor: '#A968FF',
    bio: 'Oversees cluster direction, balance, and major decisions.',
    responsibilities: ['Cluster direction', 'Balance', 'Major decisions'],
    accessLevel: 'Full Admin',
    status: 'online',
    quote: 'A greater tomorrow, built together.',
    angle: -90,
    sortOrder: 0,
  },
  {
    id: 'archmage-of-the-realms',
    name: 'Wizard',
    title: 'Archmage of the Realms',
    role: 'Realm Masters',
    tagline: 'Arcane systems & identity',
    avatar: '/assets/council/wizard.png',
    portrait: '/assets/council/wizard.png',
    energyColor: '#D6B36A',
    bio: 'Guardian of arcane systems, cluster stability, and magical identity.',
    responsibilities: ['Arcane systems', 'Cluster stability', 'Magical identity'],
    accessLevel: 'Full Admin',
    status: 'online',
    quote: null,
    angle: -45,
    sortOrder: 1,
  },
  {
    id: 'warden-of-order',
    name: 'Heathen',
    title: 'Warden of Order',
    role: 'Realm Masters',
    tagline: 'Integrity & structure',
    avatar: '/assets/council/heathen.png',
    portrait: '/assets/council/heathen.png',
    energyColor: '#FF4F65',
    bio: 'Enforcer of cluster integrity, rules, and long-term structure.',
    responsibilities: ['Cluster integrity', 'Rules', 'Long-term structure'],
    accessLevel: 'Full Admin',
    status: 'online',
    quote: null,
    angle: 0,
    sortOrder: 2,
  },
  {
    id: 'supreme-wizard',
    name: 'Emilio The Great',
    title: 'Supreme Wizard',
    role: 'Supreme Wizard',
    tagline: 'Support & conflict resolution',
    avatar: '/assets/council/emilio.png',
    portrait: '/assets/council/emilio.png',
    energyColor: '#4DA6FF',
    bio: 'Senior administrator responsible for high-level support and conflict resolution.',
    responsibilities: ['High-level support', 'Conflict resolution'],
    accessLevel: 'Admin',
    status: 'online',
    quote: null,
    angle: 45,
    sortOrder: 3,
  },
  {
    id: 'arcane-technomancer',
    name: 'B1R0N',
    title: 'Arcane Technomancer',
    role: 'Systems & Development',
    tagline: 'Where others wield spells, the Technomancer wields code.',
    avatar: '/assets/council/b1r0n.png',
    portrait: '/assets/council/b1r0n.png',
    energyColor: '#C5C9D1',
    bio: "Admin-exclusive role responsible for technical systems, development, and architecture — turning the Realm Master's and Supreme Wizards' wildest ideas into reality.",
    responsibilities: ['Technical systems', 'Development', 'Architecture', 'Automation'],
    accessLevel: 'Admin',
    status: 'online',
    quote: 'Where others wield spells, the Technomancer wields code.',
    angle: 90,
    sortOrder: 4,
  },
  {
    id: 'high-wizard-panda',
    name: 'Panda',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: '/assets/council/panda.png',
    portrait: '/assets/council/panda.png',
    energyColor: '#52E47C',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    quote: null,
    angle: 135,
    sortOrder: 5,
  },
  {
    id: 'high-wizard-rin',
    name: 'Rin',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: '/assets/council/rin.png',
    portrait: '/assets/council/rin.png',
    energyColor: '#36CFFF',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    quote: null,
    angle: 180,
    sortOrder: 6,
  },
  {
    id: 'high-wizard-doxo',
    name: 'Doxo',
    title: 'High Wizard',
    role: 'High Wizards',
    tagline: 'Tickets & player support',
    avatar: '/assets/council/doxo.png',
    portrait: '/assets/council/doxo.png',
    energyColor: '#FF9F43',
    bio: 'Ticket handling, player support, and enforcement of cluster rules.',
    responsibilities: ['Ticket handling', 'Player support', 'Rule enforcement'],
    accessLevel: 'Moderator',
    status: 'online',
    quote: null,
    angle: -135,
    sortOrder: 7,
  },
];

async function seedMaps(): Promise<void> {
  const orderIndex = new Map(
    DEFAULT_MAP_ORDER.map((displayName, index) => [displayName.toLowerCase(), index]),
  );

  for (const map of MAP_SEEDS) {
    const sortOrder =
      orderIndex.get(map.displayName.toLowerCase()) ??
      MAP_SEEDS.findIndex((entry) => entry.id === map.id);

    await prisma.arkMap.upsert({
      where: { id: map.id },
      create: {
        id: map.id,
        name: map.name,
        displayName: map.displayName,
        imagePath: map.imagePath,
        sortOrder,
      },
      update: {
        name: map.name,
        displayName: map.displayName,
        imagePath: map.imagePath,
        sortOrder,
      },
    });
  }
}

async function seedCouncil(): Promise<void> {
  for (const member of COUNCIL_SEEDS) {
    await prisma.councilMember.upsert({
      where: { id: member.id },
      create: {
        ...member,
        responsibilities: member.responsibilities,
      },
      update: {
        name: member.name,
        title: member.title,
        role: member.role,
        tagline: member.tagline,
        avatar: member.avatar,
        portrait: member.portrait,
        energyColor: member.energyColor,
        bio: member.bio,
        responsibilities: member.responsibilities,
        accessLevel: member.accessLevel,
        status: member.status,
        quote: member.quote,
        angle: member.angle,
        sortOrder: member.sortOrder,
      },
    });
  }
}

async function seedSettings(): Promise<void> {
  const settings: Array<{ key: string; value: string }> = [
    { key: 'site.name', value: 'Wizards of Ark' },
    { key: 'site.network', value: 'The Wizards Of Ark' },
    { key: 'features.eosShop', value: 'false' },
    { key: 'map.order', value: DEFAULT_MAP_ORDER.join(',') },
  ];

  for (const setting of settings) {
    await prisma.applicationSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: { value: setting.value },
    });
  }
}

async function main(): Promise<void> {
  await seedMaps();
  await seedCouncil();
  await seedSettings();
  console.log('Seeded maps, council members, and application settings');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
