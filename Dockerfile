# Build React app + monitor API
FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
COPY backend/package.json backend/yarn.lock ./backend/
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Runtime: Fastify serves API + static SPA
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV DATABASE_PATH=/data/woa-servers.sqlite
ENV STATIC_DIR=/app/dist
ENV CORS_ORIGIN=*

COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/backend/package.json /app/backend/yarn.lock ./backend/
RUN yarn install --frozen-lockfile --production=false \
  && yarn --cwd backend install --frozen-lockfile --production=false

COPY --from=build /app/dist ./dist
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json

VOLUME ["/data"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "backend/dist/index.js"]
