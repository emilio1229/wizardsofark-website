# Wizards of Ark — Static Site

This repository contains the static website for the Wizards of Ark ARK: Survival Ascended cluster.

## What’s included
- `index.html` — homepage with lore, gallery, quick summary
- `server-info.html` — full server settings, mods, and rules
- `contact.html`, `store.html` — support and store placeholders
- `style.css` — theme and layout
- `assets/` — images and favicon
- `Dockerfile`, `nginx.conf` — container configuration for static hosting
- `server.js` (optional) — lightweight Node static server
- `railway.toml` — Railway deploy config

## Quick start (Docker)
Build and run locally:
```bash
docker build -t woa-site:latest .
docker run --rm -p 8080:80 woa-site:latest
