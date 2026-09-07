export type NavLinkItem = {
  label: string;
  to: string;
};

export type HeroActionLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type RuleSection = {
  heading?: string;
  body?: string;
  items?: string[];
};

export type RuleAccordion = {
  title: string;
  sections: RuleSection[];
};

export type StoreStep = {
  title: string;
  description: string;
};

export type CouncilMember = {
  name: string;
  role: string;
  duty: string;
  image: string;
};

export type CouncilSection = {
  title: string;
  members: CouncilMember[];
};

export const siteMeta = {
  name: 'The Wizards of Ark',
  tagline: 'Forged in Magic',
  footer: 'PvE cluster across all official maps with active community support, events, and balanced progression.',
  discordUrl: 'https://discord.gg/84FDUShzE',
};

export const navLinks: NavLinkItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Server Info', to: '/server-info' },
  { label: 'Store', to: '/store' },
  { label: 'Council', to: '/council' },
  { label: 'Contact', to: '/contact' },
];

export const homeContent: {
  highlights: string[];
  joinSteps: string[];
  filterTips: string[];
  unlockSteps: string[];
  gallery: GalleryItem[];
} = {
  highlights: [
    'Complete official map cluster',
    'Boosted but balanced rates with reduced weight',
    'Active PvE community',
    'UK and US admin coverage',
    'Admin shop and in-game shop',
    'Regular events, giveaways, and custom game modes',
    'Unique creatures, mods, and perks',
    'Community suggestions that actually matter',
  ],
  joinSteps: [
    'Open ARK: Survival Ascended',
    'Go to Join Game',
    'Select the Unofficial tab',
    'Set game mode to PvE',
    'Search for The Wizards of Ark',
    'Make sure password protected is unchecked',
  ],
  filterTips: [
    'Enable Show Player Servers',
    'Disable Show Password Protected Servers',
    'Set map filter to All Maps',
    'Set PvE/PvP filter to PvE or All',
    'Confirm you are on the Unofficial tab',
    'Search The Wizards of Ark and refresh',
  ],
  unlockSteps: ['Go to discord-rules', 'Read the rules', 'Press the Enter Realm button'],
  gallery: [
    { src: '/assets/gallery1.png', alt: 'Crystal Cavern', caption: 'Grand Cavern' },
    { src: '/assets/gallery2.png', alt: 'Elder Grove', caption: 'Elder Grove' },
    { src: '/assets/gallery3.png', alt: 'Skyforge Peak', caption: 'Skyforge Peak' },
    { src: '/assets/gallery4.png', alt: 'Obsidian Depths', caption: 'Obsidian Depths' },
    { src: '/assets/gallery5.png', alt: 'Moonlit Shores', caption: 'PvP Event' },
    { src: '/assets/gallery6.png', alt: 'Dragon Nest', caption: 'Custom TP Skins' },
    { src: '/assets/gallery7.png', alt: 'Enchanted Forest', caption: 'Enchanted Forest' },
    { src: '/assets/gallery8.png', alt: 'Volcanic Realm', caption: 'Citadel Grand Hall' },
    { src: '/assets/gallery9.png', alt: 'Frozen Tundra', caption: 'Citadel of the Ember Guardian' },
    { src: '/assets/gallery10.png', alt: 'Sunken Temple', caption: 'Sunken Temple' },
    { src: '/assets/gallery11.png', alt: 'Mystic Valley', caption: 'Wizards Retreat' },
    { src: '/assets/gallery12.png', alt: 'Hidden Caverns', caption: 'Hidden Caverns' },
    { src: '/assets/gallery13.png', alt: 'Sky Bridge', caption: 'Custom 3D Logo and More' },
    { src: '/assets/gallery14.png', alt: 'Rune Circle', caption: 'Memory Hall' },
    { src: '/assets/gallery15.png', alt: 'Portal Gateway', caption: 'Great Wizard Throne Room' },
  ],
};

export const serverInfoContent: {
  quickStats: string[];
  accordions: RuleAccordion[];
} = {
  quickStats: [
    'Cluster Type: PvE',
    'Crossplay Enabled',
    'Platforms: PC / Xbox / PlayStation',
    'Maps: All Official Maps',
    'Max Player Level: 190',
    'Tribe Max: 6',
  ],
  accordions: [
    {
      title: 'Building Rules (BR)',
      sections: [
        { heading: 'BR1 - Base Limits', items: ['Max 2 bases per tribe, per map', '3rd base is removed without warning', 'Bases must be at least 500 meters apart', 'Main bases may not exceed a 500m radius', 'Exceptions require neighbor agreement and admin approval'] },
        { heading: 'BR2 - No Exploit Builds', items: ['No under-map, mesh, or glitch areas', 'No artifact caves', 'No obelisks', 'No Ovis Island (Astraeos)', 'No explorer notes and Bob’s Tales notes', 'No spawn zones', 'No Valguero Red Zone', 'No Aberration surfaces or entrances', 'No dino nests', 'No Wyvern trenches', 'No high-resource spawn zones'] },
        { heading: 'BR3 - Structure Management', items: ['No structure spam', 'Temporary build pieces must be removed', 'Max 10,000 structures per tribe, per map', 'Max 8 Gacha Gavagers', 'Max 3 Ocean Platforms', 'Max 4 cloning chambers', 'Max 3 teleporters (2 must be unlocked)', 'Tek Replicators must be turned off before logout', 'Oil rigs must remain unlocked'] },
      ],
    },
    {
      title: 'Taming and Creature Rules (TR)',
      sections: [
        { heading: 'TR1 - Tame Management', items: ['No blocking resources or paths', 'No dinos left at obelisks or caves', 'Abandoned dinos may be removed'] },
        { heading: 'TR2 - Tame Limits and Behavior', items: ['No stacking dinos', 'No stealing or trapping tames', 'First hit equals claim'] },
        { heading: 'TR3 - Starter Creature Balance', items: ['No A-tier or S-tier dinos to new players', 'No mutated or overpowered dinos', 'New players means less than 7 days in Discord', 'All gifted dinos must be spayed or neutered'] },
      ],
    },
    {
      title: 'Gameplay and Performance Rules (GR)',
      sections: [
        { heading: 'GR1 - Fair Play', items: ['No hacking, exploiting, duping, macros, or glitching'] },
        { heading: 'GR2 - Player Restrictions', items: ['One character per player', 'No alts or shared accounts'] },
        { heading: 'GR3 - Safe Zones', items: ['No structures or tames at spawns, obelisks, or teleport pads'] },
        { heading: 'GR4 - Griefing (Zero Tolerance)', items: ['No blocking bases or paths', 'No trapping players', 'No stealing tames or drops', 'No luring wilds to bases', 'No harassment or trolling'] },
        { heading: 'GR5 - Performance', items: ['Lag-causing bases may be wiped'] },
      ],
    },
    {
      title: 'Tribe and Player Rules (PR)',
      sections: [
        { items: ['Max 6 members per tribe', 'No “Human”, “123”, or offensive names', 'No duplicate tribe names', 'Admins do not replace losses caused by tribe actions', 'No harassment or hate speech', 'No advertising other servers', 'No real-money trades', 'Scams result in a permanent ban'] },
      ],
    },
    {
      title: 'Admin and Enforcement (AR)',
      sections: [
        { items: ['Admins may remove rule-breaking content', 'Violations may result in wipes, suspensions, or bans', 'Appeals must go through tickets', 'Do not DM admins for rule enforcement'] },
      ],
    },
    {
      title: 'Trading and Economy Protection Rules',
      sections: [
        { heading: 'Mutated Dino Trading', items: ['All mutated dinos must be spayed or neutered before trading'] },
        { heading: 'Breeding Line Ownership', items: ['No reselling breedable lines without permission', 'Cannot resell for less than the breeder’s price'] },
        { heading: 'Monthly Pack Restrictions', items: ['Monthly Pack creatures may only be traded among owners during the active month'] },
        { heading: 'Trade Documentation', items: ['All trades must be documented in the PvE Trading Channel'] },
        { heading: 'New Player Protection', items: ['No giving dinos to players under 7 days'] },
        { heading: 'Enforcement', items: ['Violations may result in warnings, removals, suspensions, or bans'] },
      ],
    },
    { title: 'Server Settings', sections: [{ items: ['Cluster Type: PvE', 'Crossplay Enabled', 'Platforms: PC / Xbox / PlayStation', 'Maps: All Official Maps', 'Max Player Level: 190', 'Tribe Max: 6', 'Max structures: 10,000', 'Max Ocean Platforms: 3', 'Max Cloning Chambers: 4', 'Max Gacha Gavagers: 8', 'Max bases: 2 per map'] }] },
    { title: 'General Rates', sections: [{ items: ['XP: 1.5x', 'Harvest: 5x', 'Taming: 10x', 'Resource Respawn: 0.8x delay', 'Player Weight: x15', 'Cryopods Enabled'] }] },
    { title: 'Decay Timers', sections: [{ items: ['Thatch: 4 days', 'Wood/Adobe: 12 days', 'Stone: 18 days', 'Metal: 24 days', 'Tek: 30 days', 'Creature Decay: 14 days', 'Death Bag: 1 hour'] }] },
    { title: 'Dino Settings', sections: [{ items: ['Max Wild Level: 150', 'Egg Hatch: x10', 'Maturation: x15', 'Mating Interval: x10', 'Imprint: 100% per cuddle', 'Dino Weight: x8', 'Flyer Carry Enabled', 'Dino Decay: 14 days', 'Auto Dino Wipe: Every 24h'] }] },
    { title: 'Server Management', sections: [{ items: ['Save Interval: 15-30 minutes', 'Restart: 03:00 AM PST', 'Dino Wipe: 01:00 PM GMT', 'Cleanup: Every Sunday', 'Corpse Locator Enabled', 'Admin Logging Enabled'] }] },
    { title: 'Notes and Restart Changes', sections: [{ body: 'Extended daylight, shorter nights. Rates may adjust during events.' }, { body: 'Daily Restart Time: 03:00 AM PST / 10:00 AM GMT' }] },
    { title: 'Performance Updates', sections: [{ items: ['Tame limit reduced to 80', 'Auto-destroy enabled', 'Expired creatures no longer claimable'] }] },
    { title: 'Dino Depot Changes', sections: [{ items: ['Transfer and upload disabled', 'Passive production disabled', 'Egg production disabled', 'Poop generation disabled', 'Fertilizer distribution disabled'] }] },
    { title: 'Active Mods', sections: [{ items: ['Cybers Structures QoL+', 'Dino Depot', 'Awesome Spyglass!', 'Auto Engrams!', 'Helena Bot Companion', 'Resonant’s Shop Mod', 'Additions Ascended', 'Astraeos', 'Dragon’s Kingdom', 'Shiny! Dinos Ascended', 'Zytharian Critters', 'Hatzegopteryx Kukulkan'] }] },
    { title: 'Resonant In-Game Shop Guide', sections: [{ items: ['Access: PC F1 / Console Radial Wheel', 'Points: Earn 100 points every 30 minutes', 'Purchases: Dinos, potions, custom packages', 'Trading Points: Allowed', 'Tips: Save for high-value dinos'] }] },
    { title: 'CS Tribute Terminal Guide', sections: [{ body: 'Convert non-transferable items into travel form.' }, { body: 'Each player can claim 3 Tribute Terminals per map.' }] },
    { title: 'Transfer Safety Tips', sections: [{ items: ['Stay 3-5 minutes before transferring', 'Keep important dinos in cryopods', 'Avoid map hopping too fast'] }] },
  ],
};

export const storeContent: {
  steps: StoreStep[];
  notes: string[];
} = {
  steps: [
    { title: 'Open Discord', description: 'Join the Wizards of Ark server.' },
    { title: 'Create a shop ticket', description: 'Go to #shop-tickets and click Open Shop Ticket.' },
    { title: 'Include your order details', description: 'Provide your in-game name, the item, creature, or pack you want, and any extra information staff will need.' },
    { title: 'Wait for staff confirmation', description: 'Staff will confirm availability and process your order in the ticket.' },
    { title: 'Receive your delivery', description: 'Items are delivered in game and the ticket is closed after confirmation.' },
  ],
  notes: [
    'All shop communication must happen inside your shop ticket.',
    'Do not DM admins or owners for shop requests.',
    'Delivery times may vary depending on staff availability.',
    'Questions about shop items belong in your open ticket.',
  ],
};

export const contactContent: {
  steps: string[];
  checklist: string[];
} = {
  steps: [
    'Join the Discord server.',
    'Go to #support and click Open Ticket.',
    'Provide the server or map, character name, timestamps, coordinates, and screenshots if available.',
    'Keep all follow-up in the ticket thread so staff can track evidence and actions.',
  ],
  checklist: [
    'Map name and coordinates',
    'Character name and tribe',
    'Exact time and short issue summary',
    'Screenshots, clips, or logs when available',
  ],
};

export const councilContent: {
  sections: CouncilSection[];
  automation: string[];
  principles: string[];
} = {
  sections: [
    {
      title: 'Realm Masters',
      members: [
        { name: 'Brendon', role: 'High Realm Master', duty: 'Oversees cluster direction, balance, and major decisions.', image: '/assets/brendon.png' },
        { name: 'Wizard', role: 'Archmage of the Realms', duty: 'Guardian of arcane systems, cluster stability, and magical identity.', image: '/assets/wizard.png' },
        { name: 'Heathen', role: 'Warden of Order', duty: 'Enforcer of cluster integrity, rules, and long-term structure.', image: '/assets/heathen.png' },
      ],
    },
    {
      title: 'Supreme Wizard',
      members: [
        { name: 'Emilio The Great', role: 'Supreme Wizard', duty: 'Senior administrator responsible for high-level support and conflict resolution.', image: '/assets/emilio.png' },
      ],
    },
    {
      title: 'High Wizards',
      members: [
        { name: 'Panda', role: 'High Wizard', duty: 'Ticket handling, player support, and enforcement of cluster rules.', image: '/assets/panda.png' },
        { name: 'Rin', role: 'High Wizard', duty: 'Ticket handling, player support, and enforcement of cluster rules.', image: '/assets/rin.png' },
        { name: 'Doxo', role: 'High Wizard', duty: 'Ticket handling, player support, and enforcement of cluster rules.', image: '/assets/doxo.png' },
      ],
    },
  ],
  automation: [
    'Wizards of Ark Bot - Realm automation and announcements',
    'Wizards of Ark Raffle Bot - Raffle and event automation',
    'Helena ASA - ASA data assistant',
    'Ticket Tool - Support ticket management',
    'Awesome ARK Tools - Utility and cluster tools',
    'Sesh - Scheduling and reminders',
  ],
  principles: [
    'Balance - All players treated equally',
    'Transparency - All actions logged',
    'Neutrality - No favoritism or admin advantage',
    'Proof - Assistance requires evidence',
    'Conduct - Professional behavior at all times',
    'Duty - Admin mode only for tickets and enforcement',
  ],
};