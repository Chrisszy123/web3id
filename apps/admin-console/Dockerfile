# Build stage
FROM node:20-alpine AS builder

# Set CI environment variable for pnpm
ENV CI=true

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

WORKDIR /app

# Copy package files
COPY apps/admin-console/package.json apps/admin-console/pnpm-lock.yaml ./apps/admin-console/

# Copy source code
COPY apps/admin-console ./apps/admin-console

# Set working directory to app directory
WORKDIR /app/apps/admin-console

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/apps/admin-console/dist /usr/share/nginx/html

# Create nginx config to listen on port 3000
RUN echo 'server { \
    listen 3000; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

