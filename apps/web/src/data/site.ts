import type { NavLinkItem } from '../types';

export const siteMeta = {
  name: 'Wizards of Ark',
  shortName: 'WOA',
  tagline: 'Explore • Build • Survive • Together',
  motto: 'More than a server. A community.',
  councilPhrase: 'Different Powers. One Purpose.',
  description:
    'A community-driven ARK: Survival Ascended experience. Multiple worlds. One vision.',
  discordUrl: 'https://discord.gg/84FDUShzE',
  socials: {
    discord: 'https://discord.gg/84FDUShzE',
    youtube: 'https://www.youtube.com/@wizardsofark',
    x: 'https://x.com/wizardsofark',
    reddit: 'https://www.reddit.com/r/wizardsofark',
  },
};

export const navLinks: NavLinkItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Servers', to: '/servers' },
  { label: 'The Council', to: '/council' },
  { label: 'Community', to: '/community' },
  { label: 'Shop', to: '/shop' },
  { label: 'Rules', to: '/rules' },
];

export const footerLinks: NavLinkItem[] = [
  ...navLinks,
  { label: 'Support', to: '/community' },
];
