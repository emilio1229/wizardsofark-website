# Content & Asset Management

How to edit Wizards of Ark site content without digging through UI code.

Almost all editable content lives in **`src/data/`**.  
Almost all images live in **`public/assets/`**.

---

## Quick map

| What you want to change | Edit this file | Put images here |
|-------------------------|----------------|-----------------|
| Site name, Discord, nav | `src/data/site.ts` | `public/assets/branding/` |
| Servers & maps | `src/data/servers.ts` | `public/assets/maps/` |
| Council members | `src/data/council.ts` | `public/assets/council/` |
| Community feed | `src/data/community.ts` | `public/assets/community/...` |
| Shop items | `src/data/shop.ts` | `public/assets/shop/` |
| Rules | `src/data/rules.ts` | — |
| Page heroes / atmosphere | page files or data | `public/assets/backgrounds/` |
| Staff / magical FX | — | `public/assets/effects/` |
| General screenshots | — | `public/assets/gallery/` |

Path helpers (recommended):

```ts
import { councilImagePath } from '../assets/council';
import { mapImagePath } from '../assets/maps';
import { communityImagePath } from '../assets/community';
import { shopImagePath } from '../assets/shop';
```

Defined in `src/assets/paths.ts`.

---

## Asset folder layout

```text
public/assets/
├── branding/          Logo variants, wordmark, favicon SVG
├── backgrounds/       Page heroes and atmospheric plates
├── council/           Council member portraits
├── maps/              ARK map artwork for server cards
├── community/
│   ├── events/
│   ├── guides/
│   ├── builds/
│   └── media/
├── shop/              EOS shop product images
├── effects/           Staff, particles, rune overlays
├── gallery/           General community / archive images
├── logo.png           Main logo (header/footer)
└── favicon*           Browser icons
```

After adding an image under `public/`, it is available at:

```text
/assets/<folder>/<filename>
```

Example: `public/assets/maps/ragnarok.jpg` → `/assets/maps/ragnarok.jpg`

---

## Servers & maps

**Data:** `src/data/servers.ts`  
**Images:** `public/assets/maps/`

### Add or replace a map image

1. Save the file as `{map-id}.jpg` (or `.png` / `.webp`).
2. Expected names:

| Map | File |
|-----|------|
| The Island | `the-island.jpg` |
| Scorched Earth | `scorched-earth.jpg` |
| The Center | `the-center.jpg` |
| Ragnarok | `ragnarok.jpg` |
| Valguero | `valguero.jpg` |
| Aberration | `aberration.jpg` |
| Extinction | `extinction.jpg` |
| Genesis Part 1 | `genesis-1.jpg` |
| Genesis Part 2 | `genesis-2.jpg` |
| Lost Colony | `lost-colony.jpg` |
| Astraeos | `astraeos.jpg` |
| Dragontopia | `dragontopia.jpg` |

3. If the filename matches, no code change is needed.

### Add a brand-new map / server

1. Add artwork to `public/assets/maps/`.
2. Add an entry to `arkMaps` in `src/data/servers.ts`.
3. Add a server seed object in the same file (`id`, rates, mods, etc.).

Suggested image size: **1200×675**, under ~500KB.

---

## Council members

**Data:** `src/data/council.ts`  
**Images:** `public/assets/council/`

### Update a portrait

1. Replace the file in `public/assets/council/` (e.g. `brendon.png`).
2. Hard-refresh the browser if the old image is cached.

### Add a new council member

1. Add a portrait: `public/assets/council/{name}.png` (square, ≥512×512).
2. Append an object to `councilMembers` in `src/data/council.ts`:

```ts
{
  id: 'new-role-id',
  name: 'Display Name',
  title: 'Council Title',
  role: 'Short role label',
  tagline: 'One-line flavour',
  avatar: councilImagePath('new-role-id.png'),
  portrait: councilImagePath('new-role-id.png'),
  energyColor: '#36CFFF',
  bio: 'Longer biography…',
  responsibilities: ['Item one', 'Item two'],
  status: 'online',
  // optional: angle: -90,  // degrees;  -90 = top, 0 = right
}
```

3. The constellation layout supports any number of members.  
   Omit `angle` to auto-space them evenly.

Default selected member: `DEFAULT_COUNCIL_MEMBER_ID` in the same file.

---

## Community (events, guides, builds, media)

**Data:** `src/data/community.ts`  
**Images:**

```text
public/assets/community/events/
public/assets/community/guides/
public/assets/community/builds/
public/assets/community/media/
```

### Media library page

Route: `/community/media`

The Media card on Community links here. All gallery items live in `communityMedia` inside `src/data/community.ts`.

#### Add an image

1. Drop file in `public/assets/community/media/my-shot.png`
2. Append to `communityMedia`:

```ts
{
  id: 'my-shot',
  kind: 'image',
  title: 'My Shot',
  description: 'Short caption.',
  thumbnail: communityImagePath('media', 'my-shot.png'),
  src: communityImagePath('media', 'my-shot.png'),
  tags: ['build'],
  credit: 'PlayerName',
}
```

#### Add a video

1. Optional thumbnail in `public/assets/community/media/`
2. Append with a YouTube **embed** URL:

```ts
{
  id: 'cluster-trailer',
  kind: 'video',
  title: 'Cluster Trailer',
  description: 'Official look at the realm.',
  thumbnail: communityImagePath('media', 'ember-citadel.png'),
  videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
  tags: ['trailer'],
}
```

### Add an event (example)

1. Add image: `public/assets/community/events/spring-wyvern-raid.jpg`
2. Add to `communityActivity`:

```ts
{
  id: 'spring-wyvern-raid',
  type: 'event',
  title: 'Spring Wyvern Raid',
  summary: 'Meet on Scorched Earth at 7pm UTC.',
  actionLabel: 'Join',
  to: '/community',
  image: communityImagePath('events', 'spring-wyvern-raid.jpg'),
}
```

Use `type: 'guide' | 'build' | 'media'` and the matching subfolder for other content.

Categories on the Community page come from `communityCategories` in the same file.

---

## Shop (EOS items)

**Feature flag:** `src/config/features.ts` → `eosShop`  
**Env override:** `VITE_EOS_SHOP=true`

Other header flags (default off): `search`, `themeToggle`, `account`  
(`VITE_FEATURE_SEARCH`, `VITE_FEATURE_THEME`, `VITE_FEATURE_ACCOUNT`)

While `eosShop` is `false` (default), `/shop` shows the Discord ticket purchase flow.  
Set the flag (or env) to `true` when the in-site EOS catalogue is ready.

**Data:** `src/data/shop.ts` (`shopItems` for EOS, `ticketShopContent` for Discord flow)  
**Images:** `public/assets/shop/`

### Add a shop item

1. Add image: `public/assets/shop/my-item.png`
2. Append to `shopItems`:

```ts
{
  id: 'my-item',
  name: 'My Item',
  description: 'Short description.',
  price: 250,
  category: 'skins', // structures | skins | utilities | creatures | decor
  image: shopImagePath('my-item.png'),
  featured: true, // optional — shows under Featured tab
}
```

Demo balance: `shopBalanceDemo` in the same file.

---

## Rules

**Data:** `src/data/rules.ts`

Each category has an `id`, `title`, and `rules[]` list.

```ts
{
  id: 'building',
  title: 'Building',
  rules: [
    { id: 'b1', text: 'Max 2 bases per tribe, per map.' },
  ],
}
```

Add, edit, or remove rule text here. No images required.

---

## Site-wide settings

**Data:** `src/data/site.ts`

- Brand name / taglines
- Discord URL and social links
- Main navigation (`navLinks`)
- Footer links (`footerLinks`)

Change Discord once here — header/footer/community CTAs read from this file.

---

## Backgrounds & branding

| Purpose | Folder |
|---------|--------|
| Home hero, page atmospheres | `public/assets/backgrounds/` |
| Logo variants / wordmark | `public/assets/branding/` |
| Magical FX (staff, etc.) | `public/assets/effects/` |
| Archive / general art | `public/assets/gallery/` |

Home hero currently uses:

```text
/assets/backgrounds/home-hero.jpg
```

---

## Workflow checklist

1. Drop the image into the correct `public/assets/...` folder.
2. Open the matching `src/data/*.ts` file.
3. Add or update the entry (use a path helper when possible).
4. Save — Vite hot-reloads in `yarn dev`.
5. Hard-refresh if an image looks stale (browser cache).

---

## What not to do

- Don’t hard-code member/server lists inside page components.
- Don’t put large originals in `src/` — use `public/assets/`.
- Don’t rename map files without updating `mapImagePath(...)` / `arkMaps`.
- Don’t commit secrets or Discord bot tokens into data files.

---

## Future CMS / API

These data files are intentionally thin so they can later be replaced by API calls in `src/api/` without rewriting the pages. Prefer editing data + assets now; leave page components alone unless you need a new layout.
