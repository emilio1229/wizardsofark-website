import type { CommunityActivity, CommunityCategory, CommunityMediaItem } from '../types';
import { communityImagePath } from '../assets/community';

export const communityCategories: CommunityCategory[] = [
  {
    id: 'events',
    title: 'Events',
    description: 'Boss fights, giveaways, and seasonal rituals across the cluster.',
    icon: 'event',
    to: '/community',
  },
  {
    id: 'guides',
    title: 'Guides',
    description: 'Progression tips, map routes, and shop walkthroughs from the realm.',
    icon: 'menu_book',
    to: '/community',
  },
  {
    id: 'builds',
    title: 'Builds',
    description: 'Showcase castles, outposts, and creative bases from the community.',
    icon: 'cottage',
    to: '/community',
  },
  {
    id: 'media',
    title: 'Media',
    description: 'Screenshots, clips, and stories from life in the Wizards of Ark.',
    icon: 'photo_library',
    to: '/community/media',
  },
];

/**
 * Community feed items.
 * Images live in: public/assets/community/{events|guides|builds|media}/
 */
export const communityActivity: CommunityActivity[] = [
  {
    id: 'a1',
    type: 'event',
    title: 'Weekend Titan Hunt',
    summary: 'Gather on Extinction for a coordinated titan encounter.',
    actionLabel: 'Join',
    to: '/community',
    image: communityImagePath('events', 'weekend-titan-hunt.jpg'),
  },
  {
    id: 'a2',
    type: 'build',
    title: 'Citadel of the Ember Guardian',
    summary: 'A featured base spotlight from the gallery archive.',
    actionLabel: 'View',
    to: '/community',
    image: communityImagePath('builds', 'citadel-ember-guardian.jpg'),
  },
  {
    id: 'a3',
    type: 'guide',
    title: 'Resonant Shop Starter Guide',
    summary: 'Earn points, save smart, and claim your first package.',
    actionLabel: 'Read',
    to: '/community',
    image: communityImagePath('guides', 'resonant-shop-starter.png'),
  },
  {
    id: 'a4',
    type: 'media',
    title: 'Memory Hall Showcase',
    summary: 'New screenshots from the rune circle ceremony.',
    actionLabel: 'View',
    to: '/community/media',
    image: communityImagePath('media', 'memory-hall.png'),
  },
];

/**
 * Full media library for /community/media
 * Files: public/assets/community/media/
 */
export const communityMedia: CommunityMediaItem[] = [
  {
    id: 'memory-hall',
    kind: 'image',
    title: 'Memory Hall',
    description: 'Rune circle ceremony inside the Memory Hall.',
    thumbnail: communityImagePath('media', 'memory-hall.png'),
    src: communityImagePath('media', 'memory-hall.png'),
    tags: ['ceremony', 'build'],
    credit: 'Community Archive',
    createdAt: '2026-09-01',
  },
  {
    id: 'crystal-cavern',
    kind: 'image',
    title: 'Crystal Cavern',
    description: 'Glowing caverns beneath the realm.',
    thumbnail: communityImagePath('media', 'crystal-cavern.png'),
    src: communityImagePath('media', 'crystal-cavern.png'),
    tags: ['landscape', 'exploration'],
    credit: 'Community Archive',
    createdAt: '2026-08-22',
  },
  {
    id: 'elder-grove',
    kind: 'image',
    title: 'Elder Grove',
    description: 'Ancient trees and soft arcane light.',
    thumbnail: communityImagePath('media', 'elder-grove.png'),
    src: communityImagePath('media', 'elder-grove.png'),
    tags: ['landscape'],
    credit: 'Community Archive',
    createdAt: '2026-08-18',
  },
  {
    id: 'skyforge-peak',
    kind: 'image',
    title: 'Skyforge Peak',
    description: 'High peaks overlooking floating islands.',
    thumbnail: communityImagePath('media', 'skyforge-peak.png'),
    src: communityImagePath('media', 'skyforge-peak.png'),
    tags: ['landscape', 'build'],
    credit: 'Community Archive',
    createdAt: '2026-08-12',
  },
  {
    id: 'volcanic-realm',
    kind: 'image',
    title: 'Volcanic Realm',
    description: 'Fire and ash across Scorched frontiers.',
    thumbnail: communityImagePath('media', 'volcanic-realm.png'),
    src: communityImagePath('media', 'volcanic-realm.png'),
    tags: ['landscape', 'event'],
    credit: 'Community Archive',
    createdAt: '2026-08-05',
  },
  {
    id: 'ember-citadel',
    kind: 'image',
    title: 'Citadel of the Ember Guardian',
    description: 'A featured fortress from the cluster archive.',
    thumbnail: communityImagePath('media', 'ember-citadel.png'),
    src: communityImagePath('media', 'ember-citadel.png'),
    tags: ['build'],
    credit: 'Community Archive',
    createdAt: '2026-07-28',
  },
  {
    id: 'wizards-retreat',
    kind: 'image',
    title: "Wizard's Retreat",
    description: 'A quiet sanctuary for the realm’s wizards.',
    thumbnail: communityImagePath('media', 'wizards-retreat.png'),
    src: communityImagePath('media', 'wizards-retreat.png'),
    tags: ['build'],
    credit: 'Community Archive',
    createdAt: '2026-07-20',
  },
  {
    id: 'custom-logo-build',
    kind: 'image',
    title: 'Custom 3D Crest',
    description: 'In-world Wizards of Ark crest construction.',
    thumbnail: communityImagePath('media', 'custom-logo-build.png'),
    src: communityImagePath('media', 'custom-logo-build.png'),
    tags: ['build', 'brand'],
    credit: 'Community Archive',
    createdAt: '2026-07-14',
  },
  {
    id: 'throne-room',
    kind: 'image',
    title: 'Great Wizard Throne Room',
    description: 'Council chamber lighting and ceremonial hall.',
    thumbnail: communityImagePath('media', 'throne-room.png'),
    src: communityImagePath('media', 'throne-room.png'),
    tags: ['build', 'council'],
    credit: 'Community Archive',
    createdAt: '2026-07-08',
  },
  {
    id: 'woa-trailer',
    kind: 'video',
    title: 'Enter the Realm',
    description: 'Featured trailer slot — set videoUrl in src/data/community.ts to your YouTube embed link.',
    thumbnail: communityImagePath('media', 'ember-citadel.png'),
    // Example: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
    videoUrl: '',
    tags: ['trailer', 'featured'],
    credit: 'Wizards of Ark',
    createdAt: '2026-09-01',
  },
];
