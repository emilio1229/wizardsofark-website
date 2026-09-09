import type { ShopItem } from '../types';
import { shopImagePath } from '../assets/shop';

/**
 * EOS shop catalogue.
 * Images live in: public/assets/shop/
 */
export const shopItems: ShopItem[] = [
  {
    id: 'arcane-skin-pack',
    name: 'Arcane Skin Pack',
    description: 'Enchanted armour overlays with purple rune tracery.',
    price: 500,
    category: 'skins',
    image: shopImagePath('arcane-skin-pack.png'),
    featured: true,
  },
  {
    id: 'mystic-pet-skin',
    name: 'Mystic Pet Skin',
    description: 'A glowing companion aura for your favourite tame.',
    price: 350,
    category: 'skins',
    image: shopImagePath('mystic-pet-skin.png'),
    featured: true,
  },
  {
    id: 'obsidian-gateway',
    name: 'Obsidian Gateway',
    description: 'Decorative portal frame for base entrances.',
    price: 750,
    category: 'structures',
    image: shopImagePath('obsidian-gateway.png'),
    featured: true,
  },
  {
    id: 'rune-lantern',
    name: 'Rune Lantern Set',
    description: 'Soft arcane lighting for halls and courtyards.',
    price: 200,
    category: 'decor',
    image: shopImagePath('rune-lantern.png'),
  },
  {
    id: 'crystal-storage',
    name: 'Crystal Vault',
    description: 'Utility storage with magical capacity flair.',
    price: 450,
    category: 'utilities',
    image: shopImagePath('crystal-vault.png'),
  },
  {
    id: 'ember-guardian',
    name: 'Ember Guardian',
    description: 'Limited cosmetic creature skin for event veterans.',
    price: 900,
    category: 'creatures',
    image: shopImagePath('ember-guardian.png'),
    featured: true,
  },
  {
    id: 'skyforge-banner',
    name: 'Skyforge Banner',
    description: 'Tribe banner with floating rune embroidery.',
    price: 150,
    category: 'decor',
    image: shopImagePath('skyforge-banner.png'),
  },
  {
    id: 'ward-totem',
    name: 'Ward Totem',
    description: 'Decorative totem that pulses with protective energy.',
    price: 300,
    category: 'structures',
    image: shopImagePath('ward-totem.png'),
  },
];

export const shopBalanceDemo = 1250;

/** Discord ticket shop — used while `features.eosShop` is false. */
export const ticketShopContent = {
  steps: [
    {
      title: 'Open Discord',
      description: 'Join the Wizards of Ark server.',
    },
    {
      title: 'Create a shop ticket',
      description: 'Go to #shop-tickets and click Open Shop Ticket.',
    },
    {
      title: 'Include your order details',
      description:
        'Provide your in-game name, the item, creature, or pack you want, and any extra information staff will need.',
    },
    {
      title: 'Wait for staff confirmation',
      description: 'Staff will confirm availability and process your order in the ticket.',
    },
    {
      title: 'Receive your delivery',
      description: 'Items are delivered in game and the ticket is closed after confirmation.',
    },
  ],
  notes: [
    'All shop communication must happen inside your shop ticket.',
    'Do not DM admins or owners for shop requests.',
    'Delivery times may vary depending on staff availability.',
    'Questions about shop items belong in your open ticket.',
  ],
} as const;
