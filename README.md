# Wizards of Ark — Community Portal

Production-oriented React SPA for the Wizards of Ark ARK: Survival Ascended community.

**Stack:** React · TypeScript · Material UI · React Router · TanStack Query · Framer Motion · Vite

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/servers` | Server browser |
| `/servers/:serverId` | Server detail |
| `/council` | Magical council experience |
| `/community` | Community hub |
| `/community/media` | Media gallery (images & videos) |
| `/shop` | EOS shop |
| `/rules` | Rules |

Legacy redirects: `/store` → `/shop`, `/server-info` → `/servers`, `/contact` → `/community`.

## Content & assets

To add maps, council portraits, events, shop items, or rules — see:

**[docs/CONTENT.md](./docs/CONTENT.md)**

Asset folders:

```text
public/assets/
  branding/     logos
  backgrounds/  heroes
  council/      member portraits
  maps/         ARK map art
  community/    events, guides, builds, media
  shop/         EOS product images
  effects/      staff / FX
  gallery/      general archive
```

## Structure

```text
src/
  api/          API client + domain fetchers (mock → real API ready)
  assets/       path helpers for public assets
  components/   shared UI by domain (common, navigation, server, council, …)
  data/         structured content / mock sources
  hooks/        React Query hooks
  layouts/      App shell
  pages/        route-level views
  services/     permissions and future domain services
  theme/        tokens, palette, typography, MUI overrides
  types/        shared TypeScript models
docs/
  CONTENT.md    how to edit and manage site content
```

## Local development

```bash
yarn install
yarn dev
```

## Production build

```bash
yarn build
yarn start
```

## Docker / Railway

```bash
docker compose up --build
```

Site: http://localhost:8081  
Health: http://localhost:8081/health

See `Dockerfile`, `docker-compose.yml`, `nginx.conf`, and `railway.toml`.
