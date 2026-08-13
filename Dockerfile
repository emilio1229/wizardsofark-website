# Single-container: nginx (static site) + Node proxy
FROM node:20-alpine AS builder

# Install build deps for any native modules (if needed)
RUN apk add --no-cache python3 make g++ bash

WORKDIR /app

# Copy package manifest and install production deps
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy app source (server.js etc.) and static site files
COPY . .

# Final runtime image (smaller)
FROM alpine:3.18

# Install runtime packages: nginx, node (from node:20-alpine we copied node modules, but runtime needs node)
RUN apk add --no-cache nginx nodejs npm bash

# Create directories
RUN mkdir -p /var/www/html /var/log/nginx /run/nginx
WORKDIR /app

# Copy built node modules and app from builder stage
COPY --from=builder /app /app

# Copy nginx default config (we'll use a simple config below)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 3000

# Use a non-root user for runtime (optional)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start both services
CMD ["/start.sh"]
