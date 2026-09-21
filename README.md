# The Wizards Of Ark — Community Portal

Production-oriented full-stack community portal for the The Wizards Of Ark ARK: Survival Ascended cluster.

**Stack:** React · TypeScript · Material UI · Redux Toolkit · RTK Query · Vite · NestJS · Prisma · PostgreSQL · Socket.IO · Docker · Railway

## Architecture

```text
Browser ──► apps/web (Vite SPA + Redux/RTK Query + Socket.IO client)
                │
                ▼
           apps/api (NestJS REST /api/v1 + WebSockets)
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
   PostgreSQL  ASA CDN  Redis (optional / future)
```

Shared types live in `packages/shared` and are consumed by both web and api.

## Monorepo layout

```text
apps/web/          React SPA (theme, pages, Redux store)
apps/api/          NestJS API, Prisma, ASA poller, Socket.IO
packages/shared/   Shared TS types & constants
docker/            Dockerfiles + nginx config
```

## Prerequisites

- Node.js 20+
- Yarn 1.22.x
- Docker (optional, for Compose / Postgres)

## Local setup

```bash
yarn install
yarn build:shared

# Start Postgres (Compose)
docker compose up -d postgres

# Configure API
cp apps/api/.env.example apps/api/.env
# DATABASE_URL=postgresql://woa:woa@localhost:5432/woa?schema=public

yarn prisma:generate
yarn workspace @woa/api exec prisma migrate deploy
yarn prisma:seed

# Terminal A — API
yarn dev:api

# Terminal B — Vite (proxies /api and /socket.io → :3001)
yarn dev
```

Or both:

```bash
yarn dev:all
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Vite web app |
| `yarn dev:api` | NestJS watch mode |
| `yarn build` | shared → api → web |
| `yarn test` | API unit tests |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn prisma:migrate` | Dev migrations |
| `yarn prisma:seed` | Seed maps / council / settings |

## Environment

**Web (`VITE_*` only — never put secrets here)**

- `VITE_API_URL` — default `/api/v1`
- `VITE_WS_URL` — Socket.IO origin (empty = same origin / Vite proxy)
- `VITE_API_PROXY_TARGET` — local Nest URL for Vite proxy

**API** — see [`apps/api/.env.example`](apps/api/.env.example)

## API surface

| Method | Path |
|--------|------|
| GET | `/health` |
| GET | `/api/v1/health` |
| GET | `/api/v1/servers` |
| GET | `/api/v1/servers/:id` |
| GET | `/api/v1/servers/:id/status` |
| GET | `/api/v1/maps` |
| GET | `/api/v1/council` |

Responses (non-health) use `{ "data": ..., "meta": {} }`.

## Docker Compose

```bash
docker compose up --build
```

- Web: http://localhost:8080 (nginx proxies `/api` + `/socket.io` → API)
- API: http://localhost:3001
- Postgres: localhost:5432

Optional Redis: `docker compose --profile redis up -d redis`

## Railway

Create a project with:

1. **PostgreSQL** plugin → provides `DATABASE_URL`
2. **woa-api** — Dockerfile `docker/Dockerfile.api`, health `/health`, bind `PORT`
3. **woa-web** — Dockerfile `docker/Dockerfile.web`, build args `VITE_API_URL` / `VITE_WS_URL` pointing at the public API URL

Set `FRONTEND_URL` / `CORS_ORIGIN` on the API to the web domain.

## Routes (SPA)

| Path | Page |
|------|------|
| `/` | Home |
| `/servers` | Live ASA server browser |
| `/servers/:serverId` | Server detail |
| `/council` | Magical council |
| `/community` | Community hub |
| `/community/media` | Media gallery |
| `/shop` | Shop |
| `/rules` | Rules |

## Content

Editorial map artwork, shop copy, community media, and enrichment notes still live under `apps/web/src/data` and `apps/web/public/assets`. Council/maps catalogue is also seeded into Postgres for the API.

See [`docs/CONTENT.md`](docs/CONTENT.md) and [`docs/ASA_SERVER_LIST_FIELDS.md`](docs/ASA_SERVER_LIST_FIELDS.md).

### Community media images and videos

The `/community/media` gallery is asset-driven. There is no server upload flow.

1. Put image, thumbnail, or video files in:

```text
apps/web/public/assets/community/media/
```

2. Register each item in `communityMedia`:

```text
apps/web/src/data/community.ts
```

Image example:

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

Local video example:

```ts
{
     id: 'cluster-trailer',
     kind: 'video',
     title: 'Cluster Trailer',
     description: 'Official look at the realm.',
     thumbnail: communityImagePath('media', 'cluster-trailer-thumb.png'),
     videoUrl: communityImagePath('media', 'cluster-trailer.mp4'),
     tags: ['trailer'],
     credit: 'The Wizards Of Ark',
}
```

YouTube embed example:

```ts
{
     id: 'youtube-trailer',
     kind: 'video',
     title: 'YouTube Trailer',
     description: 'Hosted trailer.',
     thumbnail: communityImagePath('media', 'trailer-thumb.png'),
     videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
     tags: ['trailer'],
}
```

Rebuild or redeploy the web app after adding new static files so they are included in the built site.
