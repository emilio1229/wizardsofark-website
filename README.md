# Wizards of Ark — Community Portal

Production-oriented React SPA for the Wizards of Ark ARK: Survival Ascended community.

**Stack:** React · TypeScript · Material UI · React Router · TanStack Query · Framer Motion · Vite · Fastify · SQLite

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/servers` | Live ASA server browser |
| `/servers/:serverId` | Server detail |
| `/council` | Magical council experience |
| `/community` | Community hub |
| `/community/media` | Media gallery (images & videos) |
| `/shop` | EOS shop |
| `/rules` | Rules |

Legacy redirects: `/store` → `/shop`, `/server-info` → `/servers`, `/contact` → `/community`.

## Live server monitoring

The `/servers` page is backed by a Node/Fastify monitor that:

1. Polls the public ASA unofficial server list
2. Filters servers by `SERVER_NAME_FILTER` (default: `The Wizards Of Ark`)
3. Persists known servers + status history in SQLite
4. Exposes `GET /api/servers` for the React app

Observed ASA fields are documented in [`docs/ASA_SERVER_LIST_FIELDS.md`](./docs/ASA_SERVER_LIST_FIELDS.md).

Browser clients never hit the ASA CDN directly.

### Local development

```bash
yarn install

# Terminal 1 — monitor API (port 3001)
yarn dev:api

# Terminal 2 — Vite SPA (proxies /api → 3001)
yarn dev
```

Config examples:

- root [`.env.example`](./.env.example)
- backend [`backend/.env.example`](./backend/.env.example)

### API tests

```bash
yarn test:api
```

## Content & assets

To add maps, council portraits, events, shop items, or rules — see:

**[docs/CONTENT.md](./docs/CONTENT.md)**

## Structure

```text
backend/        ASA poller, state engine, SQLite, /api/servers
src/
  api/          API client + domain fetchers
  features/servers/  live server types/utils
  components/   shared UI by domain
  data/         editorial content (maps, enrichment, council, …)
  pages/        route-level views
  theme/        tokens, palette, typography, MUI overrides
docs/
  ASA_SERVER_LIST_FIELDS.md
  CONTENT.md
```

## Production

```bash
yarn build
# Run the Fastify process with STATIC_DIR pointing at the Vite build,
# or run `yarn start:api` + `yarn start` (Express proxies /api).
```

Example single-process production env:

```bash
PORT=8080
STATIC_DIR=../dist
DATABASE_PATH=../data/woa-servers.sqlite
SERVER_NAME_FILTER="The Wizards Of Ark"
```

## Docker / Railway

```bash
docker compose up --build
```

Site: http://localhost:8081  
Health: http://localhost:8081/health  
API: http://localhost:8081/api/servers
