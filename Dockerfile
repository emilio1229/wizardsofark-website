# Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ | head -n 1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
