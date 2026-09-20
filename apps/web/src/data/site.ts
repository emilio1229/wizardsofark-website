import type { NavLinkItem } from '../types';

export const siteMeta = {
  name: 'The Wizards Of Ark',
  shortName: 'WOA',
  tagline: 'Explore • Build • Survive • Together',
  motto: 'More than a server. A community.',
  councilPhrase: 'Different Powers. One Purpose.',
  description:
    'A community-driven ARK: Survival Ascended experience. Multiple worlds. One vision.',
  discordUrl: 'https://discord.gg/84FDUShzE',
  socials: {
    discord: 'https://discord.gg/84FDUShzE',
    instagram: 'https://www.instagram.com/wizardsofark?stkn=ZzBqZTNmaHcycXQ3',
    x: 'https://x.com/theWizardsofArk',
    facebook: 'https://www.facebook.com/share/1Utd7iW64S/',
    arkCluster: 'https://ark.fusey.gg/ark-survival-ascended/clusters/UcqUjN93gkEDESYg-utSESnI-QNY6I0nuqFni93L7xw',
    reddit: 'https://www.reddit.com/u/WizardsofArk/s/ErNMeGc2nF',
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
