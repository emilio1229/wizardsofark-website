# Wizards of Ark — React Site

This repository now contains a React single-page application built with Vite and Material UI for the Wizards of Ark ARK: Survival Ascended cluster.

## Structure

- `src/app` — router and top-level app wiring
- `src/components` — shared layout and reusable UI sections
- `src/data` — structured site content used by the page components
- `src/pages` — route-level page components
- `src/theme` — Material UI theme configuration
- `src/styles` — global styling enhancements
- `public/assets` — static images and icons copied to the final build
- `server.js` — optional Express server for serving `dist`
- `Dockerfile`, `nginx.conf` — production container build and SPA hosting config

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

## Docker

```bash
docker build -t woa-site:latest .
docker run --rm -p 8080:80 woa-site:latest
```

## Railway Deployment

This project is configured for Railway with [railway.toml](./railway.toml).

### Build and start settings

- Builder: `RAILPACK`
- Build command: `yarn build`
- Start command: `yarn start`
- Healthcheck path: `/health`

Railway will build the Vite app into `dist` and then run the Express server in [server.js](./server.js), which serves the built SPA and handles direct refreshes on React Router paths.

### Connect the repo

1. Push this repository to GitHub.
2. In Railway, create a new project.
3. Choose `Deploy from GitHub repo` and select this repository.
4. Railway should pick up [railway.toml](./railway.toml) automatically.
5. After the first deploy, confirm the service is healthy at `/health`.

### Connect the custom domain

1. Open the Railway service.
2. Go to `Settings` or `Networking`, then add `thewizardsofark.com` as a custom domain.
3. Add `www.thewizardsofark.com` too if you want both hosts.
4. Copy the DNS records Railway shows and add them at your domain provider.
5. Wait for Railway to verify the records and issue TLS.

### DNS checklist

Use the exact values Railway gives you in the domain setup screen. The usual flow is:

1. Add the apex domain `thewizardsofark.com` in Railway.
2. Add the `www` host separately if you want `www.thewizardsofark.com` to work too.
3. At your registrar or DNS provider, remove any old records still pointing at GitHub Pages, Vercel, or another host for the same names.
4. Create or update the DNS records exactly as Railway requests for each hostname.
5. Wait for DNS to propagate, then refresh the domain status in Railway.
6. Confirm both the Railway-generated domain and your custom domain load the site.

### Domain cutover checks

After Railway marks the domain as active:

1. Open `/health` on the Railway domain and on your custom domain to confirm the service is reachable.
2. Open `/council` or another inner route directly to confirm SPA routing works after refresh.
3. Decide which hostname should be canonical: `thewizardsofark.com` or `www.thewizardsofark.com`.
4. If you want one canonical host, configure a redirect at the DNS or edge layer you use.

### If DNS does not verify

- Recheck that the hostname matches exactly, especially `@` for the apex and `www` for the subdomain.
- Make sure there is only one active record set for each hostname.
- If you use Cloudflare or another proxying DNS provider, start with proxying disabled until verification succeeds.
- Give DNS time to propagate before changing records again.

### Notes

- The repo still includes a Dockerfile for container builds, but Railway is explicitly configured to use `RAILPACK` instead.
- The React app uses clean routes, and the Express server handles SPA fallback for inner pages like `/store` and `/council`.
