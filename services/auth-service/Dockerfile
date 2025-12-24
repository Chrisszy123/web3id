FROM node:20-alpine

# Set CI environment variable for pnpm
ENV CI=true

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

WORKDIR /app

# Copy shared-types package first
COPY packages/shared-types ./packages/shared-types

# Copy service package files
COPY services/auth-service/package.json services/auth-service/pnpm-lock.yaml ./services/auth-service/

# Copy service source code
COPY services/auth-service/src ./services/auth-service/src
COPY services/auth-service/tsconfig.json ./services/auth-service/

# Set working directory to service directory
WORKDIR /app/services/auth-service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose port
EXPOSE 3001

# Start the service
CMD ["pnpm", "start"]

